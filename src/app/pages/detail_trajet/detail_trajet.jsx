import React, {useEffect, useState} from "react";
import {Navigate, useParams} from "react-router";
import {separateurTrajet} from "../../../assets/allAssets";
import {getCourse, getUser} from "../../api/RESTApi";
import {useAuth} from "../../hooks/useAuth";
import {Link} from "react-router-dom";
import {getReadableDate, getReadableTime} from "../../utils/utils";
import {canAcces} from "../../context/AuthContext";

export default function Detail_Trajet() {
  const [trajet, setTrajet] = useState("");
  const [pilot, setPilot] = useState("");
  const [duration, setDuration] = useState("");
  const [durationSec, setDurationSec] = useState("");
  const [arrivalTime, setArrivalTime] = useState("");
  const { id } = useParams();

  const { token } = useAuth();
  if(!canAcces()) return <Navigate to={"/login"} />

  if (!id) {
    return <Navigate to="/error" />;
  }

  const loadGoogleMapsScript = (startAddress, endAddress, startDate) => {
    
    const googleMapsScript = document.createElement("script");
    googleMapsScript.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDDPYxGvkeIqQyXfZZ-8AihV71PMMCHncs&libraries=routes`;
    googleMapsScript.async = true;
    window.document.body.appendChild(googleMapsScript);
    googleMapsScript.onload = () => calculateDuration(startAddress, endAddress, startDate);
  };

  const calculateDuration = (startAddress, endAddress, startDate) => {
    const service = new google.maps.DistanceMatrixService();
  
    const request = {
      origins: [startAddress],
      destinations: [endAddress],
      travelMode: google.maps.TravelMode.DRIVING,
    };
  
    service.getDistanceMatrix(request, (response, status) => {
      if (status === google.maps.DistanceMatrixStatus.OK) {
        const elementStatus = response.rows[0].elements[0]
        if (elementStatus.status === google.maps.DistanceMatrixStatus.OK) {
          const durationSec = response.rows[0].elements[0].duration.value;
          const duration = response.rows[0].elements[0].duration.text;
          const arrivalTime = calculateArrival(startDate, durationSec);
          setDurationSec(durationSec);
          setDuration(duration);
          setArrivalTime(arrivalTime);
        } 
        else {
        console.error("Error finding addresses:", elementStatus);
          const duration = "Adresses incorrectes : impossible de fournir la durée du trajet";
          const arrivalTime = startDate;
          setDuration(duration);
          setArrivalTime(arrivalTime);
        }
      }
      else {
        console.error("Error calculating direction:", status);
      }
      
      initMap(startAddress,endAddress);
    }); 
  };

  const calculateArrival = (startDate, durationSec) => {
    const departureDate = new Date(startDate);
    const arrivalDate = new Date(departureDate.getTime() + durationSec * 1000);
    return arrivalDate;
  };
  

  const initMap=(startAddress,endAddress)=> {
    const directionsRenderer = new google.maps.DirectionsRenderer();
    const directionsService = new google.maps.DirectionsService();
    
    const center = new google.maps.LatLng(0, 0);
    const mapOptions = {
      zoom:8,
      center: center 
    }
    const mapElement = document.getElementById('map');
    const map = new google.maps.Map(mapElement, mapOptions);
    directionsRenderer.setMap(map);

    const request = {
      origin: startAddress,
      destination: endAddress,
      travelMode: 'DRIVING'
    };
    directionsService.route(request, function(result, status) {
      if (status === 'OK') {
        directionsRenderer.setDirections(result);
      }
    });
  };

  useEffect(() => {
    getCourse(id, token.token)
      .then((courseResp) => {
        setTrajet(courseResp);
        const startAddress = courseResp.start;
        const endAddress = courseResp.end;
        const startDate = courseResp.date;
        getUser(courseResp.user, token.token)
          .then((userResp) => {
            setPilot(userResp.user);
            loadGoogleMapsScript(startAddress, endAddress, startDate); 
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  
  

  return (
    <div className="mb-4">
      {pilot ? ( // pas placeholder
        <div className="container col-xs-10 col-sm-9 col-md-8 col-lg-7 col-xl-6">
          <h2 className="mt-4">
            Trajet du {getReadableDate(trajet.date.split("T")[0])}
          </h2>
          <div className="card shadow">
            <ul className="list-group list-group-flush">
              <li className="list-group-item">
                <div className="d-flex justify-content-center align-items-center">
                  <div className="m-2 d-block">
                    <div className="fw-semibold">Départ</div>
                    <div className="fw-semibold mt-3">Arrivée</div>
                  </div>
                  <div className="m-2">{separateurTrajet()}</div>
                  <div className="m-2 d-block">
                    <div>{trajet.start}</div>
                    <div className="mt-3">{trajet.end}</div>
                  </div>
                </div>
                <div className="card my-2">
                  <div id="map" style={{ width: "100%", height: "400px" }}></div>
                </div>
                <div className="d-bloc">
                  <div>
                    Heure de départ :{" "}
                    {getReadableTime(trajet.date)}
                  </div>
                  <div>
                    Temps de trajet : {duration}
                  </div>
                  <div>
                    Heure d'arrivée :{" "}
                    {getReadableTime(arrivalTime)}
                  </div>
                </div>
              </li>
              <li className="list-group-item">
                Nombre de passagers : {trajet.passenger_count}
              </li>
              <li className="list-group-item d-bloc">
                <div>Détail du véhicule :</div>
                <div className="mx-4">Marque : {trajet.vehicle_brand}</div>
                <div className="mx-4">Modèle : {trajet.vehicle_model}</div>
              </li>
              <li className="list-group-item">
                Status de la course : {trajet.status}
              </li>
              <li className="list-group-item">
                Proposé le {getReadableDate(trajet.creation_date.split("T")[0])}{" "}
                par{" "}
                <Link to={`/profil/${pilot.id}`}>
                  {pilot.first_name} {pilot.last_name}
                </Link>
              </li>
            </ul>
            <div className="card-body">
              <a className="btn btn-primary">
                Participer à cette course
              </a>
            </div>
          </div>
        </div>
      ) : (
        // placeholder
        <div className="container w-50 placeholder-glow">
          <h2 className="my-4 placeholder col-5"></h2>
          <div className="card shadow">
            <ul className="list-group list-group-flush">
              <li className="list-group-item placeholder col-5 m-2"></li>
              <li className="list-group-item placeholder col-3 m-2"></li>
              <li className="list-group-item placeholder col-4 m-2"></li>
              <li className="list-group-item placeholder col-3 m-2"></li>
            </ul>
            <div className="card-body text-center">
              <a className="btn btn-outline-primary m-2 placeholder col-2"></a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}