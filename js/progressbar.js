/**
Parse the json response from virtuso server

 @authors : A Q M Saiful Islam

 @dependency
 null
 */

var progressbar  = {

    /**
     * Show progress bar
     * @param message
     * @return void
     */
    showProgressBar: function(message){
        $('.progress-bar').html(message);
        $('.progress').show();
    },

    /**
     * Hide progress bar
     * @return void
     */
    hideProgressBar: function(){
        $('.progress').fadeOut();
    }
};

