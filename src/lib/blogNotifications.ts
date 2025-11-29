// Utility functions for blog subscription and notifications

// Subscribe a user to blog notifications
export const subscribeToBlog = (email: string): { success: boolean; message: string } => {
  try {
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { success: false, message: 'Please enter a valid email address' };
    }

    // Get existing subscribers from localStorage
    const existingSubscribers = JSON.parse(localStorage.getItem('blogSubscribers') || '[]');

    // Check if email already exists
    if (existingSubscribers.includes(email)) {
      return { success: false, message: 'You are already subscribed to our blog updates' };
    }

    // Add new subscriber
    const updatedSubscribers = [...existingSubscribers, email];
    localStorage.setItem('blogSubscribers', JSON.stringify(updatedSubscribers));

    return { success: true, message: 'Thank you for subscribing! You will receive notifications when new blog posts are published.' };
  } catch (error) {
    console.error('Error subscribing to blog:', error);
    return { success: false, message: 'An error occurred while subscribing. Please try again.' };
  }
};

// Get all blog subscribers
export const getBlogSubscribers = (): string[] => {
  try {
    return JSON.parse(localStorage.getItem('blogSubscribers') || '[]');
  } catch (error) {
    console.error('Error getting blog subscribers:', error);
    return [];
  }
};

// Send notifications to all subscribers about a new blog post
export const sendBlogNotifications = (postTitle: string, postId: number): void => {
  try {
    const subscribers = getBlogSubscribers();
    
    if (subscribers.length === 0) {
      console.log('No subscribers to notify');
      return;
    }
    
    // In a real application, you would send actual emails here
    // For this localStorage-based implementation, we'll just log the notifications
    console.log(`Sending notifications to ${subscribers.length} subscribers about new blog post:`, postTitle);
    
    // Log each subscriber notification
    subscribers.forEach((email: string) => {
      console.log(`Notification sent to: ${email}`);
      // In a real implementation, you would integrate with an email service here
    });
    
  } catch (error) {
    console.error('Error sending blog notifications:', error);
  }
};

// Unsubscribe a user from blog notifications
export const unsubscribeFromBlog = (email: string): { success: boolean; message: string } => {
  try {
    const existingSubscribers = JSON.parse(localStorage.getItem('blogSubscribers') || '[]');
    
    // Check if email exists
    if (!existingSubscribers.includes(email)) {
      return { success: false, message: 'Email not found in our subscription list' };
    }
    
    // Remove subscriber
    const updatedSubscribers = existingSubscribers.filter((sub: string) => sub !== email);
    localStorage.setItem('blogSubscribers', JSON.stringify(updatedSubscribers));
    
    return { success: true, message: 'You have been unsubscribed from our blog updates.' };
  } catch (error) {
    console.error('Error unsubscribing from blog:', error);
    return { success: false, message: 'An error occurred while unsubscribing. Please try again.' };
  }
};
