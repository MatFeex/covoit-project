import "./liste_trajet.scss";
import { Link, Navigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { getUserCourses } from "../../api/RESTApi";
import PaginationList from "../../component/PaginationList";
import { getReadableDate, getReadableTime } from "../../utils/utils";
import { flecheTrajet } from "../../../assets/allAssets";
import { canAcces } from "../../context/AuthContext";
import { useAuth } from "../../hooks/useAuth";

function ListMesTrajets() {
	if (!canAcces()) return <Navigate to={"/login"} />;

	const { token } = useAuth();
  console.log(token)

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
												<Link to={`/course/${course.id}`} className="text-decoration-none link-dark">
													<div className="card shadow card-course">
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
													</div>
												</Link>
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
												<Link to={`/course/${course.id}`} className="text-decoration-none link-dark">
													<div className="card shadow card-course">
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
													</div>
												</Link>
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
