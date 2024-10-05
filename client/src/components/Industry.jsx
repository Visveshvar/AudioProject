import React, { useState } from "react";
import '../CSS/Button.css'; // Import your custom button styles
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from "react-router-dom";
const Industry = () => {

  const [plants, setPlants] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [currentPlant, setCurrentPlant] = useState({ name: "", description: "" });
  const [editIndex, setEditIndex] = useState(null);
  const [showInfo, setShowInfo] = useState({ visible: false, description: "" });

  // Function to handle adding or updating a plant card
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (editIndex !== null) {
      const updatedPlants = plants.map((plant, index) =>
        index === editIndex ? { name: currentPlant.name, description: currentPlant.description } : plant
      );
      setPlants(updatedPlants);
    } else {
      setPlants([...plants, currentPlant]);
    }
    setShowForm(false);
    setCurrentPlant({ name: "", description: "" });
    setEditIndex(null);
  };

  // Function to open the form for adding a new plant
  const addPlant = () => {
    setCurrentPlant({ name: "", description: "" });
    setEditIndex(null);
    setShowForm(true);
  };

  // Function to delete a specific plant card
  const deletePlant = (index) => {
    const updatedPlants = plants.filter((_, i) => i !== index);
    setPlants(updatedPlants);
  };

  // Function to handle editing a specific plant card
  const editPlant = (index) => {
    setCurrentPlant(plants[index]);
    setEditIndex(index);
    setShowForm(true);
  };

  // Function to display info for a specific plant card
  const showPlantInfo = (description) => {
    setShowInfo({ visible: true, description });
  };

  return (
    <div>
      <div className="container mt-4">
        {/* Button to add a new plant */}
        <button className="button mb-3" type="button" onClick={addPlant}>
          <span className="button__text">Add Plant</span>
          <span className="button__icon">
            <svg
              className="svg"
              fill="none"
              height="24"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              width="24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <line x1="12" x2="12" y1="5" y2="19"></line>
              <line x1="5" x2="19" y1="12" y2="12"></line>
            </svg>
          </span>
        </button>

        {/* Dynamic plant cards */}
        <div className="row">
          {plants.map((plant, index) => (
            <div className="col-12 mb-3" key={index}>
              {/* Reduced width for the card */}
              <div className="card p-3" style={{ maxWidth: '600px', margin: '0 auto' }}>
                <div className="d-flex align-items-center justify-content-between">
                  {/* Left Section: Edit Icon and Plant Name */}
                  <div className="d-flex align-items-center">
                    {/* Edit Icon */}
                    <span
                      className="material-icons text-dark me-3"
                      style={{ cursor: 'pointer' }}
                      onClick={() => editPlant(index)}
                      title="Edit"
                    >
                      edit
                    </span>
                    {/* Plant Name */}
                    <h5 className="card-title m-0">{plant.name}</h5>
                  </div>

                  {/* Right Section: Analytics, Info, and Delete Icons */}
                  <div className="d-flex">
                    {/* Info Icon */}
                    <span
                      className="material-icons text-dark me-2"
                      style={{ cursor: 'pointer' }}
                      onClick={() => showPlantInfo(plant.description)}
                      title="Info"
                    >
                      info
                    </span>

                    {/* Delete Icon */}
                    <span
                      className="material-icons text-dark"
                      style={{ cursor: 'pointer' }}
                      onClick={() => deletePlant(index)}
                      title="Delete"
                    >
                      delete
                    </span>
                  </div>
                </div>

                {/* "View Plant" Button */}
                <div className="d-flex justify-content-end mt-3">
                  <Link to='home/industry/plant'>
                  <button
                    className="view-plant-small-btn"
                    onClick={() => showPlantInfo(plant.description)}
                  >
                    <span>View Plant</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 74 74"
                      height="34"
                      width="34"
                    >
                      <circle strokeWidth="3" stroke="black" r="35.5" cy="37" cx="37"></circle>
                      <path
                        fill="black"
                        d="M25 35.5C24.1716 35.5 23.5 36.1716 23.5 37C23.5 37.8284 24.1716 38.5 25 38.5V35.5ZM49.0607 38.0607C49.6464 37.4749 49.6464 36.5251 49.0607 35.9393L39.5147 26.3934C38.9289 25.8076 37.9792 25.8076 37.3934 26.3934C36.8076 26.9792 36.8076 27.9289 37.3934 28.5147L45.8787 37L37.3934 45.4853C36.8076 46.0711 36.8076 47.0208 37.3934 47.6066C37.9792 48.1924 38.9289 48.1924 39.5147 47.6066L49.0607 38.0607ZM25 38.5L48 38.5V35.5L25 35.5V38.5Z"
                      ></path>
                    </svg>
                  </button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal/Form to Add/Edit Plant */}
      {showForm && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{editIndex !== null ? 'Edit Plant' : 'Add Plant'}</h5>
                <button type="button" className="btn-close" onClick={() => setShowForm(false)}></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleFormSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Plant Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={currentPlant.name}
                      onChange={(e) => setCurrentPlant({ ...currentPlant, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={currentPlant.description}
                      onChange={(e) => setCurrentPlant({ ...currentPlant, description: e.target.value })}
                      required
                    ></textarea>
                  </div>
                  <button type="submit" className="btn btn-primary">
                    {editIndex !== null ? 'Update' : 'Add'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Info Modal */}
      {showInfo.visible && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Plant Info</h5>
                <button type="button" className="btn-close" onClick={() => setShowInfo({ visible: false, description: "" })}></button>
              </div>
              <div className="modal-body">
                <p>{showInfo.description}</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowInfo({ visible: false, description: "" })}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Industry;
