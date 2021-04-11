import React, { Suspense, useEffect } from 'react';
import { useHistory, useLocation } from "react-router";

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

function App() {
    const history = useHistory();
    const query = useQuery();
    
    useEffect(() => {
        const to = query.get("to");
        if(to)
            history.push(`/view/${to}`)
        else
            history.push("/")
        
    }, []);

    return (
      <div>
          One moment...
      </div>
    );
}

export default App;