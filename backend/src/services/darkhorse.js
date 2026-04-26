const DarkHorseLog = require('../models/DarkHorseLog');
const User = require('../models/User');
const Seller = require('../models/Seller');
const Flag = require('../models/Flag');
const Notification = require('../models/Notification');

class DarkHorse {
  /**
   * Log a security or tracking event
   */
  static async logEvent(type, userId, ipAddress, action, details = {}, severity = 1) {
    try {
      await DarkHorseLog.create({
        user: userId,
        ipAddress,
        type,
        action,
        severity,
        details,
      });
      console.log(`[DarkHorse] Event Logged: ${action} [Severity: ${severity}]`);
    } catch (error) {
      console.error('[DarkHorse] Failed to log event:', error);
    }
  }

  /**
   * Flag a user for suspicious activity and increment violations
   */
  static async flagUser(userId, reason, severity = 1) {
    try {
      const user = await User.findById(userId);
      if (!user) return null;

      user.darkhorse.violationCount += severity;
      user.darkhorse.lastViolation = Date.now();
      
      // Auto-enforcement thresholds
      if (user.darkhorse.violationCount >= 5) {
        user.darkhorse.isLocked = true;
        user.darkhorse.lockReason = 'Temporary restriction applied.';
        // Lock for 10 minutes
        user.darkhorse.lockExpiresAt = new Date(Date.now() + 10 * 60 * 1000); 
      } else if (user.darkhorse.violationCount >= 3) {
        user.darkhorse.isFlagged = true;
      }

      await user.save();

      if (user.role === 'seller') {
        const seller = await Seller.findOne({ userId: user._id });
        if (seller) {
          await Flag.create({
            sellerId: seller._id,
            reason: reason,
          });

          await Notification.create({
            sellerId: seller._id,
            message: 'Your account has been flagged due to suspicious activity. Please review your actions.',
          });
        }
      }
      return user;
    } catch (error) {
      console.error('[DarkHorse] Failed to flag user:', error);
      return null;
    }
  }

  /**
   * Explicitly block a user action and log it
   */
  static async blockAction(userId, ipAddress, action, reason) {
    await this.logEvent('enforcement', userId, ipAddress, action, { reason, status: 'BLOCKED' }, 3);
    await this.flagUser(userId, reason, 1);
    
    return {
      success: false,
      darkhorse: true,
      message: 'Action blocked for security reasons.',
      reason,
    };
  }

  /**
   * Evaluate a user's current status and enforce rules
   */
  static async autoEnforce(userId) {
    const user = await User.findById(userId);
    if (!user) return { allowed: false, message: 'User not found' };

    // Check if there is an active lock
    if (user.darkhorse.isLocked) {
      if (user.darkhorse.lockExpiresAt && new Date() > user.darkhorse.lockExpiresAt) {
        // Lock expired, lift it
        user.darkhorse.isLocked = false;
        user.darkhorse.violationCount = 0; // optionally reset
        await user.save();
      } else {
        return {
          allowed: false,
          message: 'Temporary restriction applied. Please try again later.',
        };
      }
    }

    if (user.darkhorse.isFlagged) {
      return {
        allowed: true, // They can proceed but with caution
        warning: 'Verification required. We noticed unusual activity.',
      };
    }

    return { allowed: true };
  }
}

module.exports = DarkHorse;
