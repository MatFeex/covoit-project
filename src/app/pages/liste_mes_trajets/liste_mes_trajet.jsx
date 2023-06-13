import "./liste_trajet.scss";
import { Link, Navigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { getUserCourses } from "../../api/RESTApi";
import PaginationList from "../../component/PaginationList";
import { getReadableDate, getReadableTime } from "../../utils/utils";
import { flecheTrajet } from "../../../assets/allAssets";
import { canAcces } from "../../context/AuthContext";
import { useAuth } from "../../hooks/useAuth";
import { Button } from "@mui/material";

function ListMesTrajets() {
	if (!canAcces()) return <Navigate to={"/login"} />;
	const [note, setNote] = useState(5);

	const { token } = useAuth();
	console.log(token);

	const [coursesAsDriver, setCoursesAsDriver] = useState([]);
	const [coursesAsPassenger, setCoursesAsPassenger] = useState([]);

	useEffect(() => {
		getUserCourses("driver", token.token).then((resp) => {
			setCoursesAsDriver(resp);
		});
		getUserCourses("passenger", token.token).then((resp) => {
			setCoursesAsPassenger(resp);
		});
	}, []);

	const saveNoteToDriver = () => {
		if (note <= 5 && note >= 0) {
			// call API to save note
		}
	};

	const showNote = () => {
		return (
			<div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="modalMDP" aria-hidden="true">
				<div className="modal-dialog">
					<div className="modal-content">
						<div className="modal-body">
							<h4>Veuillez attribuer une note au conducteur :</h4>
							<div className="form-group mb-3">
								<label htmlFor="password">Note :</label>
								<input id="note" className="form-control" type="number" required onChange={(e) => setNote(e.target.value)} />
							</div>
						</div>
						<div className="modal-footer">
							<button type="button" className="btn btn-outline-secondary" data-bs-dismiss="modal">
								Annuler
							</button>
							<button
								type="button"
								className="btn btn-primary"
								data-bs-dismiss="modal"
								onClick={(event) => {
									setLoading(true);
									saveInfoChanges(event);
									document.getElementById("collapseInfos").classList.remove("show");
								}}
							>
								Enregistrer les modifications
							</button>
						</div>
					</div>
				</div>
			</div>
		);
	};

	return (
		<div>
			<div className="container col-xs-10 col-sm-9 col-md-8 col-lg-7 col-xl-6">
				<div className="container">
					<h2 className="p-3 fw-semibold pt-4">Liste de mes trajets</h2>
				</div>
				<div className="container d-flex">
					<div className="d-flex flex-row">
						<div className="container listcourses m-2 flex-grow mb-5">
							{coursesAsDriver.length !== 0 ? (
								<div>
									<p className="fw-semibold">Je suis conducteur</p>
									<PaginationList
										items={coursesAsDriver}
										exp={(course) => (
											<div key={course.id} className="trajet mb-3">
												<div className="card shadow card-course">
													<Link to={`/course/${course.id}`} className="text-decoration-none link-dark">
														<div className="card-body placeholder-glow">
															<h5 className="card-title fw-semibold">Trajet du {getReadableDate(course.date)}</h5>
															<div className="d-flex">
																<div className="d-bloc justify-content-start align-items-center mb-2">
																	<div>
																		{course.start}, {getReadableTime(course.date)}
																	</div>
																	<div className="m-2 d-flex align-items-end">
																		<div className="me-2">{flecheTrajet()}</div>
																		<div>{course.end}</div>
																	</div>
																</div>
															</div>
														</div>
													</Link>
													<Button className="m-4 mt-0" onClick={showNote} variant="outlined">
														Noter Mes Passagers
													</Button>
												</div>
											</div>
										)}
									/>
								</div>
							) : (
								<p>Aucun trajet en tant que conducteur.</p>
							)}
						</div>
						<div className="container listcourses m-2 flex-grow mb-5">
							{coursesAsPassenger.length !== 0 ? (
								<div>
									<p className="fw-semibold">Je suis passager</p>
									<PaginationList
										items={coursesAsPassenger}
										exp={(course) => (
											<div key={course.id} className="trajet mb-3">
												<div className="card shadow card-course">
													<Link to={`/course/${course.id}`} className="text-decoration-none link-dark">
														<div className="card-body placeholder-glow">
															<h5 className="card-title fw-semibold">Trajet du {getReadableDate(course.date)}</h5>
															<div className="d-flex">
																<div className="d-bloc justify-content-start align-items-center mb-2">
																	<div>
																		{course.start}, {getReadableTime(course.date)}
																	</div>
																	<div className="m-2 d-flex align-items-end">
																		<div className="me-2">{flecheTrajet()}</div>
																		<div>{course.end}</div>
																	</div>
																</div>
															</div>
														</div>
													</Link>
													<Button className="m-4 mt-0" onClick={showNote} variant="outlined">
														Noter Mon Conducteur
													</Button>
												</div>
											</div>
										)}
									/>
								</div>
							) : (
								<p>Aucun trajet en tant que passager.</p>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
export default ListMesTrajets;
