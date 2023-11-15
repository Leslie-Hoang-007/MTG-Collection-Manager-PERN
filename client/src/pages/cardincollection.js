import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import axios from "axios";
import Switch from 'react-switch';
import HandleRefreshToken from "../components/refreshToken";

export const CardInCollection = () => {
    const { cardincollection_id } = useParams();
    const [card, setCard] = useState(null);
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
            // console.log(cardincollection_id);
            const baseURL = process.env.NODE_ENV === 'production' ? `/api/collection?cardincollection_id=${cardincollection_id}` : `http://localhost:5000/api/collection?cardincollection_id=${cardincollection_id}`;
            const response = await axios.get(baseURL, { withCredentials: true });
            // const data = response.data;
            await setCard(response.data.card);
            // console.log(response.data.card);
            // console.log(card.grade_id);
        } catch (error) {

            if (error.response && error.response.status === 419) {
                await HandleRefreshToken();
                // Retry the original request
                await fetchCard();
            } else {
                console.error("Error fetching cards:", error);
            }
        }
    };

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



    // CHANGES CARD PRICE IN COLLECTON
    const handleUpdate = async () => {

        console.log(editGrade, editCompany);
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

        // FETCH - UPDATE STATS
        try {
            let companygradedby_id = editCompany;
            let grade_id = editGrade;
            let isfoil = editFoil;
            let count = parseInt(editCount);
            let value = parseInt(editPrice);
            const baseURL = process.env.NODE_ENV === 'production' ? '/api/collection' : 'http://localhost:5000/api/collection';

            const response = await axios.put(baseURL, { cardincollection_id, companygradedby_id, grade_id, isfoil, count, value }, { withCredentials: true });

            console.log(response);
            // REFRESH CARD STATS
            fetchCard();
        } catch (error) {

            if (error.response && error.response.status === 419) {
                await HandleRefreshToken();
                // Retry the original request
                await handleUpdate();
            } else {
                console.log("Error updating card:", error)
            }

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
                <h3>Card Condition</h3>

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
        if (!checked) {
            setEditCompany(null);
            setEditGrade(null);
        }
    };

    // Once the data is loaded, you can display it on the page
    return (
        <main className="main">
            <div className="container">
                <div className="card-page-inner-container">
                    <div className="card-image-container">

                        <img src={card['image_uris.normal']} alt={card.name} />
                    </div>
                    <div className="card-info">
                        <div className="card-block">
                            <h1>{card.name} - {card.set_name}</h1>
                        </div>
                        <div className="card-block">
                            <h2>Set Name: <a to={`/cards/init/${card.set_name}`}>{card.set_name}</a></h2>
                        </div>
                        <div className="card-block">
                            <h2>Flavor</h2>
                            <p> {card.flavor_text}</p>
                        </div>
                        <div className="card-block">
                            <h2>Rules</h2>
                            <p> {card.oracle_text}</p>
                        </div>
                        <div className="card-block">
                            <h2>Rarity</h2>
                            <p>{card.rarity}</p>
                        </div>
                        <div className="card-block">
                            <h2>Card Type</h2>
                            <p>{card.type_line}</p>
                        </div>
                        <div className="card-block">
                            <h2>Mana Cost</h2>
                            <p>{card.mana_cost}</p>
                        </div>
                    </div>
                </div>







                <div className="cc-update-container">
                    <div className="card-block" id="flex">
                        <div>

                            <h2>Count</h2>
                            <p>{card.count}</p>
                        </div>
                        <div>

                            <h2>Price</h2>
                            <p>{card.value}</p>
                        </div>
                    </div>


                    <div className="card-block" id="flex">
                        <div>
                            <h2>Card Variant:</h2>
                            <p>{card.isfoil ? "Foil" : "Normal"}</p>
                        </div>
                        <div >
                            <h2>Grade</h2>
                            <p>{card.grade_description ? card.grade_description : 'Unknown'}</p>
                        </div>
                    </div>
                </div>
                <div className="cc-update-container">
                    <div className="modal-body">
                        <h1>Update Card</h1>


                        <div className="field" id="center">

                            <label>
                                Card Variant
                                {/* <input type="text" value={editFoil} onChange={(e) => setEditFoil(e.target.value)} /> */}
                                <select onChange={(e) => setEditFoil(e.target.value)}>
                                    <option value="">Select Variant</option>
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
                            <button onClick={handleUpdate}
                                disabled={(editGrade == null || editGrade == "" || editGrade == card.grade_id) && (editFoil == null || editFoil == "" || card.isfoil == (editFoil == 'true')) && (editCount == null || editCount == "" || editCount == 0 || editCount == card.count) && (editPrice === null || editPrice == "" || editPrice == card.value)}
                                id={
                                    ((editGrade == null || editGrade == "" || editGrade == card.grade_id) && (editFoil == null || editFoil == "" || card.isfoil == (editFoil == 'true')) && (editCount == null || editCount == "" || editCount == 0 || editCount == card.count) && (editPrice === null || editPrice == "" || editPrice == card.value))
                                        ? 'disabledUpdateButton'
                                        : ""
                                }
                            >Save Update</button>
                            <label>Graded card</label>

                            <Switch
                                onChange={handleToggle}
                                checked={cardCondition}
                                id="xxx"
                            />
                        </div>

                        <div>
                            {/* <input
                    type="checkbox"
                    checked={showComponent}
                    onChange={() => setShowComponent(!showComponent)}
                /> */}


                            {cardCondition ? renderCondition() : null}

                        </div>

                    </div>
                </div>
            </div>
        </main>
    );
};