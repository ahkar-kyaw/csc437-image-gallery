import { useState } from "react";
import { Routes, Route, useNavigate } from "react-router";

import { VALID_ROUTES } from "./shared/ValidRoutes.js";

import { MainLayout } from "./MainLayout.jsx";
import { ProtectedRoute } from "./ProtectedRoute.jsx";

import { AllImages } from "./images/AllImages.jsx";
import { ImageDetails } from "./images/ImageDetails.jsx";
import { UploadPage } from "./UploadPage.jsx";
import { LoginPage } from "./LoginPage.jsx";

function App() {
  const [authToken, setAuthToken] = useState(null);
  const navigate = useNavigate();

  function handleAuthToken(token) {
    setAuthToken(token);
    navigate(VALID_ROUTES.HOME);
  }

  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route
          path={VALID_ROUTES.LOGIN}
          element={<LoginPage isRegistering={false} onAuthToken={handleAuthToken} />}
        />
        <Route
          path={VALID_ROUTES.REGISTER}
          element={<LoginPage isRegistering={true} onAuthToken={handleAuthToken} />}
        />

        <Route
          path={VALID_ROUTES.HOME}
          element={
            <ProtectedRoute authToken={authToken}>
              <AllImages authToken={authToken} />
            </ProtectedRoute>
          }
        />

        <Route
          path={VALID_ROUTES.IMAGE_DETAILS}
          element={
            <ProtectedRoute authToken={authToken}>
              <ImageDetails authToken={authToken} />
            </ProtectedRoute>
          }
        />

        <Route
          path={VALID_ROUTES.UPLOAD}
          element={
            <ProtectedRoute authToken={authToken}>
              <UploadPage />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<p>404 Not Found</p>} />
      </Route>
    </Routes>
  );
}

export default App;