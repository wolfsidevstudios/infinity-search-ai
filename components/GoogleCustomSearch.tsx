import React, { useEffect } from 'react';

interface GoogleCustomSearchProps {
  query: string;
}

const GoogleCustomSearch: React.FC<GoogleCustomSearchProps> = ({ query }) => {
  useEffect(() => {
    // 1. Load the Google CSE script if it hasn't been loaded yet
    const scriptId = 'google-cse-script';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://cse.google.com/cse.js?cx=d556e248c32f249f2';
      script.async = true;
      document.head.appendChild(script);
    }

    // 2. Trigger the search programmatically once the API is ready
    const triggerSearch = () => {
      // @ts-ignore
      if (window.google && window.google.search && window.google.search.cse && window.google.search.cse.element) {
        // @ts-ignore
        const element = window.google.search.cse.element.getElement('infinity-search');
        if (element) {
          element.execute(query);
        }
      }
    };

    // Retry binding until script loads
    const intervalId = setInterval(() => {
        // @ts-ignore
        if (window.google) {
            triggerSearch();
            clearInterval(intervalId);
        }
    }, 200);

    return () => clearInterval(intervalId);
  }, [query]);

  return (
    <div className="w-full bg-white rounded-[32px] p-6 shadow-xl overflow-hidden min-h-[500px]">
        <div className="flex items-center gap-2 mb-4">
            <img src="https://www.google.com/favicon.ico" alt="G" className="w-6 h-6" />
            <h3 className="text-black font-bold text-xl">Google Results</h3>
        </div>
        {/* 
            We use 'gcse-searchresults-only' to suppress the input box 
            since we are driving it with the app's main input.
            data-gname allows us to target this specific instance via JS.
        */}
        <div 
            className="gcse-searchresults-only" 
            data-gname="infinity-search"
            data-image_as_rights="cc_publicdomain"
        ></div>
        
        {/* Custom Styles for CSE to match Infinity aesthetic slightly better */}
        <style>{`
            .gsc-control-cse {
                padding: 0 !important;
                border: none !important;
                background-color: transparent !important;
                font-family: 'Plus Jakarta Sans', sans-serif !important;
            }
            .gsc-result-info {
                padding-left: 0 !important;
            }
            .gsc-webResult.gsc-result {
                padding: 1rem 0 !important;
                border-bottom: 1px solid #eee !important;
            }
            .gs-title {
                text-decoration: none !important;
                font-size: 18px !important;
            }
            .gs-title b {
                color: #2563EB !important;
            }
            .gsc-url-top {
                display: none !important;
            }
            .gsc-thumbnail-inside {
                padding: 0 !important;
            }
            .gsc-cursor-page {
                border-radius: 50% !important;
                width: 30px !important;
                height: 30px !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                margin-right: 8px !important;
            }
            .gsc-cursor-current-page {
                background-color: black !important;
                color: white !important;
            }
        `}</style>
    </div>
  );
};

export default GoogleCustomSearch;