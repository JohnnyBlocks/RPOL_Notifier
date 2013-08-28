RPOL_Notifier
=============

Chrome Extension for RPOL Game Alerts, leveraging RPOL RSS feeds

This extension will leverage the RPOL.net RSS feeds to provide visual notification of new posts in games.

I created this extension due to the nature of RPOL RSS.  

The issue is that most readers dont value the updates in the RSS feeds from RPOL.  
This is due to the data feed only having one item per game, and having that one item updated.  
For some reason, most readers do not value that update as new content and fail to alert.

Here is a thread from RPOL on this issue: http://rpol.net/display.cgi?gi=9590&ti=1467

This extension will save your personal RSS feed found here: http://rpol.net/usermodules/profile.cgi?action=feeds

It will visually display status indicators from those feeds allowing you to know a game has been updated.

Once completed, this will ideally be published under Chrome Extensions in the Play store.

Development Status
------------------

1.  Extension / Manifest created.
2.  Icon created.
3.  Options Menu Created
4.  Save to Google Sync to allow it to work on authenticated clients (more than 1 PC)

Next is to process the RSS feed on a timed interval and display the notification.

Due to RPOL architecture, preview of the game post in the extension is not possible.
