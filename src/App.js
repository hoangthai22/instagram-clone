import React, { Suspense, useEffect } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import "./App.css";
import { Loading } from "./components/Loading/loading";
import Main from "./components/Main";
import { AddCardModal } from "./components/Modal/AddCardModal/AddCardModal";
import InviteMemberModals from "./components/Modal/InviteMemberModals";
import ShowCardModal from "./components/Modal/ShowCardModal/ShowCardModal";
import AppProvider from "./Context/AppProvider";
import AuthProvider from "./Context/AuthProvider";
import Login from "./features/Auth/Login";
import Register from "./features/Auth/Register";
import { auth } from "./firebase/config";
import { SettingModal } from "./components/Modal/SettingModal/SettingModal";
import { ChangeAvatarModal } from "./components/Modal/ChangeAvatar/ChangeAvatar";
function App() {
	useEffect(() => {
		const unsubscribed = auth.onAuthStateChanged((user) => {
			if (user) {
				return;
			}
		});
		//clean function
		return () => {
			unsubscribed();
		};
	}, []);

	return (
		<Suspense fallback={<div>Loading ...</div>}>
			<BrowserRouter>
				<AuthProvider>
					<AppProvider>
						<Loading />
						{/* {header ? <HeaderComponent /> : ""} */}
						<Switch>
							<Route path="/login" component={Login} />
							<Route path="/register" component={Register} />
							<Route path="/" component={Main} />
						</Switch>
						<ShowCardModal />
						<InviteMemberModals />
						<SettingModal />
						<AddCardModal />
						<ChangeAvatarModal/>
					</AppProvider>
				</AuthProvider>
			</BrowserRouter>
		</Suspense>
	);
}

export default App;
