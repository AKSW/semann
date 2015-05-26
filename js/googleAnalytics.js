/**
Parse the json response from virtuso server

 @authors : A Q M Saiful Islam

 @dependency
 null
 */

var googleAnalytics  = {

    /**
     * Send information to google analytics if the logging is configured as true
     *
     * @param type
     * @param event
     * @param msg
     * @param value
     */
    logEvent: function(type, event, msg, value) {

        if (applicationSettings && applicationSettings.isLoggingOn) {
            ga(type, event, msg, value);
        }
    }
};

