import React from 'react';
import { TailSpin } from 'react-loader-spinner'; // Import the spinner from the library

const Loader = () => {
    return (
        <div className="flex flex-col justify-center items-center h-full">
            <TailSpin
                height="80"
                width="80"
                color="#00BFFF"
                ariaLabel="loading"
            />
            <p className="mt-4 text-lg font-semibold text-gray-700">
                Please wait, loading data...
            </p>
        </div>
    );
};

export default Loader;
