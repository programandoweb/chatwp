import React from 'react';
import { Routes, Route } from 'react-router-dom';
import NotFound from '../components/NotFound';

const useMyRoutes = (routes_modules) => {
  return (

      <Routes>
        {routes_modules.map((module, index) => {
          return <Route key={index}
                        path={module.path}
                        element={<module.component/>}
                />
        })}
        <Route path="*" element={<NotFound />} />
      </Routes>

  );
};

export default useMyRoutes;
