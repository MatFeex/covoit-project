import {Link} from "react-router-dom";
import {getReadableDate, getReadableTime} from "../utils/utils";
import {flecheTrajet} from "../../assets/allAssets";
import React, {useEffect, useState} from "react";


export default function PaginationList({ items }){
    const [page, setPage] = useState(1);
    const [nPerPage, setNPerPage] = useState(3);
    const [listPageBtn, setListPageBtn] = useState([1, 2, 3])
    const [currentItems, setCurrentItems] = useState(items.slice(0, nPerPage));

    const maxPage = () => Math.ceil(items.length / nPerPage);

    const changePage = (page) => {
        console.log("change page", page)
        if(page < 1) return;
        if(page > maxPage()) setPage(maxPage());
        else setPage(page);
    }
    useEffect(() => {
        setCurrentItems(items.slice((page-1)*nPerPage, page*nPerPage));

        if(page === 1 || maxPage() <= 3) setListPageBtn(Array.from(Array(Math.min(3, maxPage())).keys(), x => x + 1));
        else if(page === maxPage()) setListPageBtn([page-2, page-1, page]);
        else setListPageBtn([page-1, page, page+1]);
    }, [page, nPerPage]);

    const updateNPerPage = (e) => setNPerPage(e.target.value);
    useEffect(() => changePage(page), [nPerPage]);


    return (
        <>
            <nav aria-label="Page navigation example">
                <ul className="pagination">
                    <li className={"page-item"+(page === 1 && ' disabled')}><a className="page-link" onClick={() => changePage(page-1)}>Previous</a></li>
                    {
                        listPageBtn.map((p) => (
                            <li className={"page-item"+(p === page && " active") } id={"pageBtn"+p}><a className="page-link" onClick={() => changePage(p)}>{p}</a></li>
                        ))
                    }
                    <li className={"page-item"+(page === maxPage() && ' disabled')}><a className="page-link" onClick={() => changePage(page+1)}>Next</a></li>
                </ul>
            </nav>
            <select className="custom-select" id="selectNPerPage" onChange={(e) => updateNPerPage(e)}>
                {
                    [1, 3, 5].map((n) => (
                        <option value={n} selected={nPerPage === n}>{n}</option>
                    ))
                }
            </select>

            {currentItems.map((course) => {
                {
                    let test = new Date(course.date);
                }
                return (
                    <div key={course.id} className="trajet mb-3">
                        <Link to={`/course/${course.id}`} className="text-decoration-none link-dark">
                            <div className="card shadow card-course">
                                <div className="card-body placeholder-glow">
                                    <h5 className="card-title fw-semibold">
                                        Trajet du {getReadableDate(course.date)}
                                    </h5>
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
                );
            })}

        </>
    )

}