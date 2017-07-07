# MMM-MyNextBus

This a module for [MagicMirror](https://github.com/MichMich/MagicMirror/tree/develop).

This shows you upcoming vehicle arrival times for any transit agency supported by NextBus.


## Installation
1. Navigate into your MagicMirror `modules` folder and execute<br>
`git clone https://github.com/jclarke0000/MMM-MyNextBus.git`.
2. Enter the new `MMM-MyNextBus` directory and execute `npm install`.

## Configuration

<table>
  <thead>
    <tr>
      <th>Option</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>agency</code></td>
      <td><strong>REQUIRED</strong> The transit agency tag.<br><br><strong>Type</strong> <code>String</code><br />See below for more instructions on configuring your `agency`.</td>
    </tr>
    <tr>
      <td><code>routeList</code></td>
      <td><strong>REQUIRED</strong> An array of route tag and stop tag pairs.<br><br><strong>Type</strong> <code>Array</code><br />See below for more instructions on configuring your `routeList`.</td>
    </tr>
    <tr>
      <td><code>updateInterval</code></td>
      <td>How frequently in milliseconds to poll for data from TTC's public API.<br><br><strong>Type</strong> <code>Integer</code><br>Defaults to <code>60000</code> (i.e.: 1 minute)</td>
    </tr>
  </tbody>
</table>

## Detailed Configuration instructions

### Transit Agency

Go here for the list of agencies supported by NextBus:
http://webservices.nextbus.com/service/publicXMLFeed?command=agencyList

Find the agency you'd like, and copy the `tag` value into your config file.  e.g. `agency : 'ttc'`

### Route List

Each entry in your `routeList` consists of a route tag and stop tag.  In all of the URL examples below, you'll need to replace the `a=ttc` parameter with your agency.  (e.g.: `a=rutgers`)

First determine which routes you're interested in (e.g.: `501` for the Queen St. streetcar). The full list of routes are listed here:
http://webservices.nextbus.com/service/publicXMLFeed?command=routeList&a=ttc

Next, got to `http://webservices.nextbus.com/service/publicXMLFeed?command=routeConfig&a=ttc&r=501`.  Replace the parameter `r=501` in the URL
with whatever route you're interested in.  Determine which stop you want to see arrival times for. Usually this will be the one you
normally go to to wait for your bus or streetcar.  You'll need the value in the `tag` parameter, for example `2332`, as found in this line:

`<stop tag="2332" title="Queen St East At Yonge St (Queen Station)" lat="43.6525499" lon="-79.37909" stopId="3079"/>`

It's not explicitly listed whether the stop is for a particular direction on the route, but they are listed in order, and if you are familiar
with the route you should be able to figure out the right stop tag.

At bare minimum you need one entry, with two properties:

* `routeNo` - the route tag from the first step above
* `stop` - the stop tag along the route.

You can test that you have the right combination by going to:
`http://webservices.nextbus.com/service/publicXMLFeed?&command=predictionsForMultiStops&a=ttc&stops=501|2332`.  Replace the `stops` parameter
at the end of the URL with the route tag and stop tag separater by the pipe `|` character.

Repeat for as many stops and routes as you would like.

Your config should something like this:

```
{
  module: 'MMM-MyNextBus',
  position: 'top_left',
  header: 'TTC Schedule',
  config: {
    agency: 'ttc',
    routeList: [
      {
        routeNo : '501',
        stop : '6108'
      },
      {
        routeNo : '501',
        stop : '2332'
      },
      {
        routeNo : '301',
        stop : '2332',
      },
      {
        routeNo : '143',
        stop: '1148'
      },
      {
        routeNo : '64',
        stop : '9055'
      }
    ]
  }
},
```

By default, each entry in your route list will use the `bus` icon.  You can specify one of four icons to use for each route:
`bus`, `tram`, `subway`, or `train`.

```
{
  module: 'MMM-MyNextBus',
  position: 'top_left',
  header: 'TTC Schedule',
  config: {
    agency: 'ttc',
    routeList: [
      {
        routeNo : '501',
        stop : '6108',
        icon: 'tram'
      },
      {
        routeNo : '501',
        stop : '2332',
        icon: 'tram',
      },
      {
        routeNo : '301',
        stop : '2332',
        //no icon specified.  defaults to 'bus'
      },
      {
        routeNo : '143',
        stop: '1148',
        icon: 'train'
      },
      {
        routeNo : '64',
        stop : '9055',
        icon: 'subway'
      }
    ]
  }
},
```

You'll notice above that I have two entries for the `501` route, but with different stops.  I've done this to monitor both eastbound and westbound
cars passing through the same intersection.  If you leave this as-is, both entries will have the same title, as they are for the same route, just
different directions. Therefore you can specify an additional parameter for a given entry to override the label.  

For example:

```
{
  module: 'MMM-MyNextBus',
  position: 'top_left',
  header: 'TTC Schedule',
  config: {
    agency: 'ttc',
    routeList: [
      {
        routeNo : '501',
        stop : '6108',
        icon: 'tram',        
        label : 'Queen Westbound'
      },
      {
        routeNo : '501',
        stop : '2332',
        icon: 'tram',        
        label : 'Queen Eastbound'
      },
      {
        routeNo : '301',
        stop : '2332',
      },
      {
        routeNo : '143',
        stop: '1148',
        icon: 'train'        
      },
      {
        routeNo : '64',
        stop : '9055',
        icon: 'subway'        
      }
    ]
  }
},
```

Finally, if you would like to colour code your entries, you can specify an optional parameter 'color' that will give the route tag whatever
color scheme you specify in hexadecimal format.  You can specify any or all of `borderColor`, `backgroundColor`, and `textColor`. e.g.:

```
{
  routeNo : '501',
  stop : '6108',
  icon: 'tram',
  label : 'Queen Westbound',
  color : {
    borderColor: "#FF0000",
    backgroundColor: "#FF0000",
    textColor: "#FFFFFF"
  }
},
```

Lastly, it should be noted that this module will hide a route entirely if there are no scheduled vehicles.  So if you're only seeing some of
your list entries, it's because that particular route isn't currently running, say because it's late at night or because the particular route
only operates during rush hour (e.g.: the downtown express routes).



## List of Transit Agencies Supported by NextBus

Current as of 7-July-2017

<table>
  <thead>
    <tr>
      <th>
        Agency
      </th>
      <th>
        Region
      </th>
      <th>
        Tag (value for config)
      </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        AC Transit
      </td>
      <td>
        California-Northern
      </td>
      <td>
        actransit
      </td>
    </tr>
    <tr>
      <td>
        APL
      </td>
      <td>
        Maryland
      </td>
      <td>
        jhu-apl
      </td>
    </tr>
    <tr>
      <td>
        Asheville Redefines Transit
      </td>
      <td>
        North Carolina
      </td>
      <td>
        art
      </td>
    </tr>
    <tr>
      <td>
        Atlanta Streetcar - Beta
      </td>
      <td>
        Georgia
      </td>
      <td>
        atlanta-sc
      </td>
    </tr>
    <tr>
      <td>
        Brockton Area Transit Authority
      </td>
      <td>
        Massachusetts
      </td>
      <td>
        brockton
      </td>
    </tr>
    <tr>
      <td>
        Camarillo Area (CAT)
      </td>
      <td>
        California-Southern
      </td>
      <td>
        camarillo
      </td>
    </tr>
    <tr>
      <td>
        Cape Cod Regional Transit Authority (CCRTA)
      </td>
      <td>
        Massachusetts
      </td>
      <td>
        ccrta
      </td>
    </tr>
    <tr>
      <td>
        Chapel Hill Transit
      </td>
      <td>
        North Carolina
      </td>
      <td>
        chapel-hill
      </td>
    </tr>
    <tr>
      <td>
        Charles River TMA - EZRide
      </td>
      <td>
        Massachusetts
      </td>
      <td>
        charles-river
      </td>
    </tr>
    <tr>
      <td>
        Charm City Circulator
      </td>
      <td>
        Maryland
      </td>
      <td>
        charm-city
      </td>
    </tr>
    <tr>
      <td>
        City College NYC
      </td>
      <td>
        New York
      </td>
      <td>
        ccny
      </td>
    </tr>
    <tr>
      <td>
        City of Oxford
      </td>
      <td>
        Mississippi
      </td>
      <td>
        oxford-ms
      </td>
    </tr>
    <tr>
      <td>
        City of West Hollywood
      </td>
      <td>
        California-Southern
      </td>
      <td>
        west-hollywood
      </td>
    </tr>
    <tr>
      <td>
        Config Stuff
      </td>
      <td>
        Other
      </td>
      <td>
        configdev
      </td>
    </tr>
    <tr>
      <td>
        CyRide
      </td>
      <td>
        Iowa
      </td>
      <td>
        cyride
      </td>
    </tr>
    <tr>
      <td>
        DC Circulator
      </td>
      <td>
        District of Columbia
      </td>
      <td>
        dc-circulator
      </td>
    </tr>
    <tr>
      <td>
        DC Streetcar
      </td>
      <td>
        District of Columbia
      </td>
      <td>
        dc-streetcar
      </td>
    </tr>
    <tr>
      <td>
        Downtown Connection
      </td>
      <td>
        New York
      </td>
      <td>
        da
      </td>
    </tr>
    <tr>
      <td>
        Downtown Connection
      </td>
      <td>
        New York
      </td>
      <td>
        dta
      </td>
    </tr>
    <tr>
      <td>
        Dumbarton Express
      </td>
      <td>
        California-Northern
      </td>
      <td>
        dumbarton
      </td>
    </tr>
    <tr>
      <td>
        East Carolina University
      </td>
      <td>
        North Carolina
      </td>
      <td>
        ecu
      </td>
    </tr>
    <tr>
      <td>
        Escalon eTrans
      </td>
      <td>
        California-Northern
      </td>
      <td>
        escalon
      </td>
    </tr>
    <tr>
      <td>
        Fairfax (CUE)
      </td>
      <td>
        Virginia
      </td>
      <td>
        fairfax
      </td>
    </tr>
    <tr>
      <td>
        Foothill Transit
      </td>
      <td>
        California-Southern
      </td>
      <td>
        foothill
      </td>
    </tr>
    <tr>
      <td>
        Fort Worth The T
      </td>
      <td>
        Texas
      </td>
      <td>
        ft-worth
      </td>
    </tr>
    <tr>
      <td>
        Glendale Beeline
      </td>
      <td>
        California-Southern
      </td>
      <td>
        glendale
      </td>
    </tr>
    <tr>
      <td>
        Gold Coast Transit
      </td>
      <td>
        California-Southern
      </td>
      <td>
        south-coast
      </td>
    </tr>
    <tr>
      <td>
        Indianapolis International Airport
      </td>
      <td>
        Indiana
      </td>
      <td>
        indianapolis-air
      </td>
    </tr>
    <tr>
      <td>
        Jacksonville Transportation Authority
      </td>
      <td>
        Florida
      </td>
      <td>
        jtafla
      </td>
    </tr>
    <tr>
      <td>
        Los Angeles Metro
      </td>
      <td>
        California-Southern
      </td>
      <td>
        lametro
      </td>
    </tr>
    <tr>
      <td>
        Los Angeles Rail
      </td>
      <td>
        California-Southern
      </td>
      <td>
        lametro-rail
      </td>
    </tr>
    <tr>
      <td>
        MBTA
      </td>
      <td>
        Massachusetts
      </td>
      <td>
        mbta
      </td>
    </tr>
    <tr>
      <td>
        Massachusetts Institute of Technology
      </td>
      <td>
        Massachusetts
      </td>
      <td>
        mit
      </td>
    </tr>
    <tr>
      <td>
        Mission Bay
      </td>
      <td>
        California-Northern
      </td>
      <td>
        sf-mission-bay
      </td>
    </tr>
    <tr>
      <td>
        Moorpark Transit
      </td>
      <td>
        California-Southern
      </td>
      <td>
        moorpark
      </td>
    </tr>
    <tr>
      <td>
        Nova Southeastern University
      </td>
      <td>
        Florida
      </td>
      <td>
        nova-se
      </td>
    </tr>
    <tr>
      <td>
        Omnitrans
      </td>
      <td>
        California-Southern
      </td>
      <td>
        omnitrans
      </td>
    </tr>
    <tr>
      <td>
        Palos Verdes Transit
      </td>
      <td>
        California-Southern
      </td>
      <td>
        pvpta
      </td>
    </tr>
    <tr>
      <td>
        Pensacola Beach (SRIA)
      </td>
      <td>
        Florida
      </td>
      <td>
        sria
      </td>
    </tr>
    <tr>
      <td>
        Portland Streetcar
      </td>
      <td>
        Oregon
      </td>
      <td>
        portland-sc
      </td>
    </tr>
    <tr>
      <td>
        Prince Georges County
      </td>
      <td>
        Maryland
      </td>
      <td>
        pgc
      </td>
    </tr>
    <tr>
      <td>
        RTC RIDE, Reno
      </td>
      <td>
        Nevada
      </td>
      <td>
        reno
      </td>
    </tr>
    <tr>
      <td>
        Radford Transit
      </td>
      <td>
        Virginia
      </td>
      <td>
        radford
      </td>
    </tr>
    <tr>
      <td>
        Roosevelt Island
      </td>
      <td>
        New York
      </td>
      <td>
        roosevelt
      </td>
    </tr>
    <tr>
      <td>
        Rutgers Univ. Newark College Town Shuttle
      </td>
      <td>
        New Jersey
      </td>
      <td>
        rutgers-newark
      </td>
    </tr>
    <tr>
      <td>
        Rutgers University
      </td>
      <td>
        New Jersey
      </td>
      <td>
        rutgers
      </td>
    </tr>
    <tr>
      <td>
        SEPTA
      </td>
      <td>
        Pennsylvania
      </td>
      <td>
        septa
      </td>
    </tr>
    <tr>
      <td>
        San Francisco Muni
      </td>
      <td>
        California-Northern
      </td>
      <td>
        sf-muni
      </td>
    </tr>
    <tr>
      <td>
        Seattle Streetcar
      </td>
      <td>
        Washington
      </td>
      <td>
        seattle-sc
      </td>
    </tr>
    <tr>
      <td>
        Simi Valley (SVT)
      </td>
      <td>
        California-Southern
      </td>
      <td>
        simi-valley
      </td>
    </tr>
    <tr>
      <td>
        Societe de transport de Laval
      </td>
      <td>
        Quebec
      </td>
      <td>
        stl
      </td>
    </tr>
    <tr>
      <td>
        Sonoma County Transit
      </td>
      <td>
        California-Northern
      </td>
      <td>
        sct
      </td>
    </tr>
    <tr>
      <td>
        Thousand Oaks Transit (TOT)
      </td>
      <td>
        California-Southern
      </td>
      <td>
        thousand-oaks
      </td>
    </tr>
    <tr>
      <td>
        Toronto Transit Commission (TTC)
      </td>
      <td>
        Ontario
      </td>
      <td>
        ttc
      </td>
    </tr>
    <tr>
      <td>
        Unitrans ASUCD/City of Davis
      </td>
      <td>
        California-Northern
      </td>
      <td>
        unitrans
      </td>
    </tr>
    <tr>
      <td>
        University of California San Francisco
      </td>
      <td>
        California-Northern
      </td>
      <td>
        ucsf
      </td>
    </tr>
    <tr>
      <td>
        University of Maryland
      </td>
      <td>
        Maryland
      </td>
      <td>
        umd
      </td>
    </tr>
    <tr>
      <td>
        University of Minnesota
      </td>
      <td>
        Minnesota
      </td>
      <td>
        umn-twin
      </td>
    </tr>
    <tr>
      <td>
        Ventura Intercity (VCTC)
      </td>
      <td>
        California-Southern
      </td>
      <td>
        vista
      </td>
    </tr>
    <tr>
      <td>
        Western Kentucky University
      </td>
      <td>
        Kentucky
      </td>
      <td>
        wku
      </td>
    </tr>
    <tr>
      <td>
        Winston-Salem
      </td>
      <td>
        North Carolina
      </td>
      <td>
        winston-salem
      </td>
    </tr>
    <tr>
      <td>
        York College
      </td>
      <td>
        Pennsylvania
      </td>
      <td>
        york-pa
      </td>
    </tr>
  </tbody>
</table>