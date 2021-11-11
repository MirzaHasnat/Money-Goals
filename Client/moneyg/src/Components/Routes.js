    import React from 'react';
    import Auth from './User/Auth';
    import Error401 from './Error/401';


    // create a component for protected route


    export const ProtectedRoute = (props) => {
        if(Auth.isAuthed()){
            return props.children;
        }else{
            return <Error401 />;
        }
    }
