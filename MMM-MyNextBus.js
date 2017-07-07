/*********************************

  Magic Mirror Module: 
  MMM-MyNextBus
  https://github.com/jclarke0000/MMM-MyNextBus

  By Jeff Clarke
  MIT Licensed
 
*********************************/

Module.register("MMM-MyNextBus", {

  defaults: {
    agency: "ttc",
    routeList: [
      {
        routeNo : "501",
        stop : "8813",
        icon : "tram"
      },
      {
        routeNo : "143",
        stop: "8813",
      }
    ],
    updateInterval: 60000, //update every minute
  },

  transitIcons: [
    "tram",
    "bus",
    "subway",
    "train"
  ],

  // Define required styles.
  getStyles: function () {
    return ["MMM-MyNextBus.css"];
  },

  svgIconFactory: function(glyph) {

    var svg = document.createElementNS("http://www.w3.org/2000/svg","svg");
    svg.setAttributeNS(null, "class", "transit-mode-icon");
    var use = document.createElementNS("http://www.w3.org/2000/svg", "use");
    use.setAttributeNS("http://www.w3.org/1999/xlink", "href", this.file("icon_sprite.svg#") + glyph);
    svg.appendChild(use);
    
    return(svg);
  },  

  start: function() {

    Log.info("Starting module: " + this.name);

    this.loaded = false; 
    this.transitData = null;

    //start getting data
    this.getData();

    var self = this;
    setInterval(function() {
      self.getData();
    }, this.config.updateInterval);
  },

  getData: function() {
    this.sendSocketNotification("MMM-MyNextBus-GET", {instanceId: this.identifier, config: this.config});
  },

  socketNotificationReceived: function(notification, payload) {
    //only update if a data set is returned.  Otherwise leave stale data on the screen.
    if ( notification === "MMM-MyNextBus-RESPONSE" + this.identifier && payload != null) {
      this.transitData = payload;

      //only fade in tye module after the first data pull
      if (!this.loaded) {
        this.loaded = true;
        this.updateDom(2000);
      } else {
        this.updateDom();
      }
    }

  },

  getDom: function() {

    var wrapper = document.createElement("div");
    wrapper.classList.add("wrapper");

    if (!this.loaded) {
      wrapper.innerHTML = this.translate("LOADING");
      wrapper.className = "dimmed light small";
      return wrapper;
    } else if (this.transitData == null) { //should never get here, but just in case.
      wrapper.innerHTML = "No schedule";
      wrapper.className = "dimmed light small";
      return wrapper;
    }

    var noData = true;
    for (var i = 0; i < this.transitData.length; i++) {

      //skip entries with no scheduled times
      if (this.transitData[i].noSchedule) {
        continue;
      }

      //if execution gets here then we have a schedule for at least one route
      noData = false;

      var routeContainer = document.createElement("div");
      routeContainer.classList.add("route-container");

      var icon = this.svgIconFactory( (this.transitData[i].icon && this.transitIcons.indexOf(this.transitData[i].icon) != -1) ? this.transitData[i].icon : "bus" );
      icon.classList.add("transit-icon", "bright");
      routeContainer.appendChild(icon);

      var routeTitle = document.createElement("div");
      routeTitle.classList.add("route-title", "bright");

      var routeNo = document.createElement("span");
      routeNo.classList.add("route-no");
      routeNo.innerHTML = this.transitData[i].routeNo;

      if (this.transitData[i].color) {
        var cObj = this.transitData[i].color;
        if (cObj.textColor) {
          routeNo.style.color = cObj.textColor;
        }
        if (cObj.borderColor) {
          routeNo.style.borderColor = cObj.borderColor;
        }
        if (cObj.backgroundColor) {
          routeNo.style.backgroundColor = cObj.backgroundColor;
        }
      }
      routeTitle.appendChild(routeNo);

      var routeTitleText = document.createElement("span");
      routeTitleText.innerHTML = this.transitData[i].routeTitle;
      routeTitle.appendChild(routeTitleText);

      routeContainer.appendChild(routeTitle);

      var stopTitle = document.createElement("div");
      stopTitle.classList.add("stop-title", "bright");
      stopTitle.innerHTML = "@ " + this.transitData[i].stopTitle;
      routeContainer.appendChild(stopTitle);

      for (var j = 0; j < this.transitData[i].branches.length; j++) {

        var branchContainer = document.createElement("div");
        branchContainer.classList.add("branch-container");
        
        var branchTitle = document.createElement("span");
        branchTitle.classList.add("branch-title");
        branchTitle.innerHTML = this.transitData[i].branches[j].title;
        branchContainer.appendChild(branchTitle);

        var nextVehicles = document.createElement("span");
        nextVehicles.classList.add("next-vehicles");
        if (this.transitData[i].branches[j].nextVehicles.length > 0) {
          nextVehicles.classList.add("bright");
          for (var k = 0; k < this.transitData[i].branches[j].nextVehicles.length; k++) {
            var minutes = document.createElement("span");
            minutes.innerHTML = this.transitData[i].branches[j].nextVehicles[k];
            nextVehicles.appendChild(minutes);
            if (k < this.transitData[i].branches[j].nextVehicles.length - 1) {
              var comma = document.createElement("span");
              comma.innerHTML=", ";
              nextVehicles.appendChild(comma);
            } 
          }
          var suffix = document.createElement("span");
          suffix.innerHTML=" min";
          nextVehicles.appendChild(suffix);
        } else {
          nextVehicles.innerHTML = "No schedule";                    
        }
        branchContainer.appendChild(nextVehicles);

        routeContainer.appendChild(branchContainer);
      }


      wrapper.appendChild(routeContainer);

    }

    if (noData) {
      wrapper.innerHTML = "No schedule";
      wrapper.className = "dimmed light small";
    }

    return wrapper;

  }

});