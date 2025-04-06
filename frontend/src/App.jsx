import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/home/HomePage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import WatchPage from "./pages/WatchPage";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/authUser";
import { useEffect } from "react";
import { Loader } from "lucide-react";
import SearchPage from "./pages/SearchPage";
import SearchHistoryPage from "./pages/SearchHistoryPage";
import NotFoundPage from "./pages/404";
import ProfilePage from "./pages/ProfilePage";
import MovieDetailsPage from "./pages/MovieDetailsPage";
import TvShowDetailsPage from "./pages/TvShowDetailsPage";
import PersonDetailsPage from "./pages/PersonDetailsPage";
import BrowseCategoryPage from "./pages/BrowseCategoryPage";
import MyListPage from "./pages/MyListPage";

function App() {
	const { user, isCheckingAuth, authCheck } = useAuthStore();

	useEffect(() => {
		authCheck();
	}, [authCheck]);

	if (isCheckingAuth) {
		return (
			<div className='h-screen'>
				<div className='flex justify-center items-center bg-black h-full'>
					<Loader className='animate-spin text-red-600 size-10' />
				</div>
			</div>
		);
	}

	return (
		<>
			<Routes>
				<Route path='/' element={<HomePage />} />
				<Route path='/login' element={!user ? <LoginPage /> : <Navigate to={"/"} />} />
				<Route path='/signup' element={!user ? <SignUpPage /> : <Navigate to={"/"} />} />
				<Route path='/watch/:id' element={user ? <WatchPage /> : <Navigate to={"/login"} />} />
				<Route path='/search' element={user ? <SearchPage /> : <Navigate to={"/login"} />} />
				<Route path='/history' element={user ? <SearchHistoryPage /> : <Navigate to={"/login"} />} />
				
				{/* New routes */}
				<Route path='/profile' element={user ? <ProfilePage /> : <Navigate to={"/login"} />} />
				<Route path='/movie/:id' element={user ? <MovieDetailsPage /> : <Navigate to={"/login"} />} />
				<Route path='/tv/:id' element={user ? <TvShowDetailsPage /> : <Navigate to={"/login"} />} />
				<Route path='/person/:id' element={user ? <PersonDetailsPage /> : <Navigate to={"/login"} />} />
				<Route path='/browse/:category' element={user ? <BrowseCategoryPage /> : <Navigate to={"/login"} />} />
				<Route path='/my-list' element={user ? <MyListPage /> : <Navigate to={"/login"} />} />

				<Route path='/*' element={<NotFoundPage />} />
			</Routes>

			<Toaster />
		</>
	);
}

export default App;
