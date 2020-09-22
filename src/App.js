import React, {Component, Fragment, useState} from 'react';
import {Map, Marker, TileLayer, Popup} from "react-leaflet";
import { Sidebar, Tab } from 'react-leaflet-sidetabs';
import { FiChevronRight } from "react-icons/fi";
import { FaMapMarkedAlt } from "react-icons/fa";
import WomenInTheWorld from "./Components/WomenInTheWorldData";
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import MaterialTable from "material-table";
import { Button } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import projectCenters from "./Components/IQPLocations";
import colnames from "./Components/Column";
import './App.css';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

var popup = L.popup();

let markerLayers = {};

let currentCountry;


var WCenters = [];
let WCenterInfo = [];
let sponsorInfo = {};
let filteredInfo = {};
let currentInfo = {};




function FindingProjectCenters() {
  projectCenters.forEach(function (key) {
    WomenInTheWorld.forEach(function (Center) {
      if (key.name === Center.ProjectCenter){
        WCenters.push(key);
        WCenterInfo.push(Center);
      }
    });
  })
}

FindingProjectCenters();
let uniqueCenters = [...new Set(WCenters)]

function showPopup(){
  this.openPopup();
}

function hidePopup(){
  this.closePopup();
}


export default class App extends Component{
  constructor(props) {
    super(props);
    this.state = {
      collapsed: true,
      selected: 'home',
    };
  }

  onClose() {
    this.setState({collapsed: true});
  }
  onOpen(id) {
    this.setState({
      collapsed: false,
      selected: id,
    })
  }

  handleClick = (country) => (e) => {
    WCenterInfo = [];
    WomenInTheWorld.forEach(function (Center) {
      if (country === Center.ProjectCenter){
        WCenterInfo.push(Center);
      }
    });
    this.onOpen("settings");
  }

  handleButtonClick = () => (e) => {
    WCenterInfo = [];
    projectCenters.forEach(function (key) {
      WomenInTheWorld.forEach(function (Center) {
        if (key.name === Center.ProjectCenter){
          WCenterInfo.push(Center);
        }
      });
    })
    this.onOpen("settings");
  }

  render() {
    return (
        <Fragment>
          <Sidebar
              id="sidebar"
              position="right"
              collapsed={this.state.collapsed}
              closeIcon={<FiChevronRight />}
              selected={this.state.selected}
              onOpen={this.onOpen.bind(this)}
              onClose={this.onClose.bind(this)}
          >
            <Tab id="settings" header="Project Centers" icon={<FaMapMarkedAlt />}>
              <div>
                <Box mt={2} />
                <MaterialTable title="IQPs"
                               columns={colnames.map((c) => ({ ...c, tableData: undefined }))}
                               data={WCenterInfo}
                               options={{
                                 search: true,
                                 exportButton: true,
                                 pageSize:5,
                                 pageSizeOptions: [10]
                               }}/>
                <Box mt={2} />
                <Button style={{
                  backgroundColor: "#0074d9",
                }}
                        onClick={this.handleButtonClick()}
                        variant="contained" color="primary">
                  Clear
                </Button>
              </div>
            </Tab>
          </Sidebar>
          <Map style={{ height: "100vh", width: "100%" }} className="mapStyle" center={[0, 0]} zoom={3}>
            <TileLayer
                attribution='Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012'
                url={'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}'}
            />
            {uniqueCenters.map((center, k) => {
              let position = [center["coordinates"][0], center["coordinates"][1]]
              return (
                  <Marker
                      key={k}
                      onMouseOver={(e) => {
                        e.target.openPopup();
                      }}
                      onMouseOut={(e) => {
                        e.target.closePopup();
                      }}
                      onClick={this.handleClick(center.name)}
                      position={position}
                  >
                    <Popup> {center.name} </Popup>
                  </Marker>
              )
            })
            }
          </Map>
        </Fragment>
    )
  }

}