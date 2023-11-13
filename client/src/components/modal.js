
import { motion } from "framer-motion";
import { Backdrop } from "./backdrop";
import React, { useEffect, useState } from "react";

import { useCookies } from "react-cookie";
import Switch from 'react-switch';


import axios from "axios";
const dropIn = {
  hidden: {
    y: "-100vh",
    opacity: 0,
  },
  visible: {
    y: "0",
    opacity: 1,
    transition: {
      duration: 0.1,
      type: "spring",
      damping: 50,
      stiffness: 500,
    },
  },
  exit: {
    y: "100vh",
    opacity: 0,
  },
};

const Modal = ({ handleClose, card, graded }) => {


  const [cookies, _] = useCookies();

  const user_id = cookies.access_token;
  const card_id = card.id;
  const collection_id = cookies.collection_id;


  const [company, setCompany] = useState([]);
  const [grades, setGrades] = useState([]);
  const [filteredGrades, setFilteredGrades] = useState([]);
  const [editCompany, setEditCompany] = useState(null);
  const [editGrade, setEditGrade] = useState(null);
  const [editFoil, setEditFoil] = useState(null);
  const [editCount, setEditCount] = useState(null);
  const [editPrice, setEditPrice] = useState(null);


  const [cardCondition, setCardCondition] = useState(false);


  useEffect(() => {
    fetchGrades();
    console.log(graded);
    if (graded){
      setCardCondition(true);
    }
  }, []);

  // FETCH GRADING COMPANY AND ALL GRADES
  const fetchGrades = async () => {
    try {
      const baseURL = process.env.NODE_ENV === 'production' ? `/api/grade` : `http://localhost:5000/api/grade`;
      const response = await axios.get(baseURL);
      // console.log(response.data.companygradedby);
      setCompany(response.data.companygradedby);
      setGrades(response.data.grades);

    } catch (error) {
      console.error(error);
    }
  };

  // CHANGES GRADES DEPEND ON GRADING COMPANY SELECTED
  const handleCompany = (companygradedby_id) => {
    setFilteredGrades(grades.filter((grades) => grades.companygradedby_id == companygradedby_id));
    setEditCompany(companygradedby_id);
    setEditGrade(null);
    // console.log("company", companygradedby_id, "grade", editGrade);
  };

  // TOGGLE TO SEE IF GRADING IS SELECTED OR NOT
  const handleToggle = (checked) => {
    setCardCondition(checked);
    if (!checked) {
      setEditCompany(null);
      setEditGrade(null);
    }
  };

  // RENDER LIST OF GRADING COMPANY AND GRADES
  const renderCondition = () => {
    let x =
      <div className="field" id="select-grade">
        <select onChange={(e) => handleCompany(e.target.value)}>
          <option value="">Select a Company</option>
          {company.map((company) => (
            <option key={company.companygradedby_id} value={company.companygradedby_id}>
              {company.company_name}
            </option>
          ))}
        </select>

        <select onChange={(e) => setEditGrade(e.target.value, console.log(editCompany, e.target.value))}>
          <option value="">Select a Grade</option>
          {filteredGrades.map((grade) => (
            <option key={grade.grade_id} value={grade.grade_id}>
              {grade.grade_description}
            </option>
          ))}
        </select>

      </div>;
    return x;
  }



  // CHANGES CARD PRICE IN COLLECTON
  const handleAddCard = async () => {

    // ERROR HANDELING FOR GRADINGCOMPAN AND GRADE
    if (editGrade || editCompany) {
      if (!editGrade) {
        setEditCompany(null);
        setEditGrade(null);

      }
      if (!editCompany) {
        setEditGrade(null);
      }
    }

    try {
      let companygradedby_id = editCompany;
      let grade_id = editGrade;
      let isfoil = editFoil;
      let count = parseInt(editCount);
      let value = parseInt(editPrice);

      const baseURL = process.env.NODE_ENV === 'production' ? '/api/cards' : 'http://localhost:5000/api/cards';
      const response = await axios.post(baseURL, { user_id, collection_id, card_id, companygradedby_id, grade_id, isfoil, count, value });

      console.log(response);
    } catch (error) {
      console.log("SERVER ERROR", error)
    }

  };

  return (
    <Backdrop onClick={handleClose}>
      <motion.div
        onClick={(e) => e.stopPropagation()}
        className="modal orange-gradient"
        variants={dropIn}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <div className="modal">
          <div className="modal-header">

            <h1>Add {card.name} - {card.set_name}</h1>
          </div>
          <div className="modal-body">

            <div className="field">
              <label>
                Edit Count:
                <input placeholder="1" type="text" value={editCount} onChange={(e) => setEditCount(e.target.value)} />
              </label>
              <label>
                Card Variant
                <select onChange={(e) => setEditFoil(e.target.value)}>
                  <option value="">Select Foil</option>
                  <option value="false">Normal</option>
                  <option value="true">Foil</option>
                </select>
              </label>
              <label>
                Edit Price:
                <input placeholder = {card["prices.usd"]} type="text" value={editPrice} onChange={(e) => setEditPrice(e.target.value)} />
              </label>
            </div>

            <div className="field" id = "price">
      
            </div>


            <div>
              <h3>Card Condition</h3>

              <Switch
                onChange={handleToggle}
                checked={cardCondition}
                id="xxx"
              />

              {cardCondition ? renderCondition() : null}

            </div>

            <button onClick={() => { handleAddCard(); handleClose(); }}>Add to Collection</button>
          </div>
        </div>


      </motion.div>
    </Backdrop>
  );
};

export default Modal;