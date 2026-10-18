import {Route, Routes} from "react-router-dom"
import DashboardLayout from "../layout/DashboardLayout"
import MyStudyLibrary from "../components/MyStudyLibrary/MyStudyLibrary"
import ROUTES from "../constant/routes"
import StudyRoom from "../components/StudyRoom/StudyRoom"
import StudyPlanner from "../components/studyPlanner/StudyPlanner"

export default function AppRoute() {
  return <Routes>
    <Route index element={<h1>Home page</h1>} />
    <Route element={<DashboardLayout/>}>
      <Route path={ROUTES.STUDY_LIBRARY} element={<MyStudyLibrary/>} />
      <Route path={ROUTES.STUDY_ROOM + "/:playlistID"} element={<StudyRoom/>} />
      <Route path={ROUTES.STUDY_PLANNER} element={<StudyPlanner/>} />
    </Route>
  </Routes>
}
