import React, {createContext, useMemo, useState} from "react";
import {Outlet} from "react-router-dom";
import MuiAlert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";


const InfoContext = createContext();

export default InfoContext;

export const InfoProvider = () => {

	const [openError, setOpenError] = useState(false);
	const [textError, setTextError] = useState("Error !");
	const [openSuccess, setOpenSuccess] = useState(false);
	const [textSuccess, setTextSuccess] = useState("Success !");
	const [openBackdrop, setOpenBackdrop] = useState(false);

    const Alert = React.forwardRef(function Alert(props, ref) {
        return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    });

	const handleClose = (e, reason) => {
		if (reason === "clickaway") {
			return;
		}
		setOpenSuccess(false);
		setOpenError(false);
	};

	const contextData = useMemo(() => {
		return {
			openError,
			setOpenError,
			textError,
			setTextError,
			openSuccess,
			setOpenSuccess,
			textSuccess,
			setTextSuccess,
			openBackdrop,
			setOpenBackdrop,
		};
	}, [openError, setOpenError, textError, setTextError, openSuccess, setOpenSuccess, textSuccess, setTextSuccess, openBackdrop, setOpenBackdrop]);


	return (
		<InfoContext.Provider value={contextData}>
			<Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={openBackdrop} onClick={handleClose}>
				<CircularProgress color="inherit" />
			</Backdrop>

			<Snackbar open={openError} autoHideDuration={5000} onClose={handleClose}>
				<Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
					{textError}
				</Alert>
			</Snackbar>

			<Snackbar open={openSuccess} autoHideDuration={5000} onClose={handleClose}>
				<Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
					{textSuccess}
				</Alert>
			</Snackbar>

			<Outlet />

		</InfoContext.Provider>
	);
};
