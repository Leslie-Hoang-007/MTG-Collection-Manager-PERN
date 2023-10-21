import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import Switch from 'react-switch';

export const CardInCollection = () => {
    const { cardincollection_id } = useParams();
    const [card, setCard] = useState(null);
    const [cookies, _] = useCookies();
    const [company, setCompany] = useState([]);
    const [grades, setGrades] = useState([]);
    const [filteredGrades, setFilteredGrades] = useState([]);

    const [editCompany, setEditCompany] = useState(null);
    const [editGrade, setEditGrade] = useState(null);
    const [editFoil, setEditFoil] = useState(null);
    const [editCount, setEditCount] = useState(null);
    const [editPrice, setEditPrice] = useState(null);


    const [cardCondition, setCardCondition] = useState(false);

    // FETCH CARD DATA BASED ON USER AND INDEX IN COLLECTION
    useEffect(() => {
        fetchCard();
        fetchGrades();
    }, []);

    const fetchCard = async () => {
        try {
            console.log(cardincollection_id);
            const response = await axios.get(`http://localhost:5000/collection?cardincollection_id=${cardincollection_id}`);
            // const data = response.data;
            await setCard(response.data.card);
            // console.log(response.data.card);
            // console.log(card.grade_id);
        } catch (error) {
            console.error("Error fetching set names:", error);
        }
    };

    const fetchGrades = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/grade`);
            // console.log(response.data.companygradedby);
            setCompany(response.data.companygradedby);
            setGrades(response.data.grades);

        } catch (error) {
            console.error(error);
        }
    };



    // CHANGES CARD PRICE IN COLLECTON
    const handleUpdate = async () => {

        
      // ERROR HANDELING FOR GRADINGCOMPAN AND GRADE
        if (editGrade || editCompany) {
            if (!editGrade) {
                // setEditCompany(null);
                return;
            }
            if (!editCompany) {
                // setEditGrade(null);
                return;
            }
        }

        // HANDLE IF NOTHING IS CHANGED THAN DO NOTHING WHEN CLICKED
        if (!editGrade && !editCompany && !editFoil && !editCount && !editPrice) {
            return;
        }

        // FETCH - UPDATE STATS
        try {
            let companygradedby_id = editCompany;
            let grade_id = editGrade;
            let isfoil = editFoil;
            let count = parseInt(editCount);
            let value = parseInt(editPrice);

            const response = await axios.put('http://localhost:5000/collection', { cardincollection_id, companygradedby_id, grade_id, isfoil, count, value });

            console.log(response);
            // REFRESH CARD STATS
            fetchCard();
        } catch (error) {
            console.log("SERVER ERROR", error)
        }

    };

    const handleCompany = (companygradedby_id) => {
        setFilteredGrades(grades.filter((grades) => grades.companygradedby_id == companygradedby_id));
        setEditCompany(companygradedby_id);
        setEditGrade(null);
        console.log("company", companygradedby_id, "grade", editGrade);
    };

    if (!card) {
        return <div>Loading...</div>;
    }

    const renderCondition = () => {
        let x =
            <div>
     
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

    const handleToggle = (checked) => {
        setCardCondition(checked);
        if (!checked){
            setEditCompany(888);
            setEditGrade(888);
        }
      };

    // Once the data is loaded, you can display it on the page
    return (
        <div>
            <h1>{card.name} - {card.set_name}</h1>
            <img src={card['image_uris.normal']} alt={card.name} />
            <p>Product Details<br /> {card.oracle_text}</p>
            <p>Rarity:<br /> {card.rarity}</p>
            <p>Card Type:<br /> {card.type_line}</p>
            <p>Grade: {card.grade_description ? card.grade_description : 'Unknown'}</p>
            <p>Card Variant: {card.isfoil ? "Foil" : "Normal"}</p>



            <p>Count: {card.count}</p>
            <p>Price: {card.value}</p>


            <div>
                <h3>Card Condition</h3>
                {/* <input
                    type="checkbox"
                    checked={showComponent}
                    onChange={() => setShowComponent(!showComponent)}
                /> */}

                <Switch
                    onChange={handleToggle}
                    checked={cardCondition}
                    id="xxx"
                />
                <label>Graded card</label>
                {cardCondition ? renderCondition(): null}
                
            </div>


            <label>
                Card Variant
                {/* <input type="text" value={editFoil} onChange={(e) => setEditFoil(e.target.value)} /> */}
                <select onChange={(e) => setEditFoil(e.target.value)}>
                    <option value="">Select Foil</option>
                    <option value="false">Normal</option>
                    <option value="true">Foil</option>
                </select>
            </label>
            <label>
                Edit Count:
                <input type="text" value={editCount} onChange={(e) => setEditCount(e.target.value)} />
            </label>
            <label>
                Edit Price:
                <input type="text" value={editPrice} onChange={(e) => setEditPrice(e.target.value)} />
            </label>

            <button onClick={handleUpdate}>Save Update</button>
        </div>
    );
};