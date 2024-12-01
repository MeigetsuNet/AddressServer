window.onload = () => {
    const spec = {};
    fetch('./resources/openapi.json')
        .then(r => r.json())
        .then(res => {
            const ui = SwaggerUIBundle({
                //url: './openapi.json',
                spec: res,
                dom_id: '#swagger-ui',
                deepLinking: true,
                presets: [SwaggerUIBundle.presets.apis, SwaggerUIStandalonePreset],
                plugins: [SwaggerUIBundle.plugins.DownloadUrl],
                layout: 'StandaloneLayout',
            });
            window.ui = ui;
        })
        .catch(er => console.error(er));
};
