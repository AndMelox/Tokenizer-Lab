const middlewareHost = window.env.MIDDLEWARE_HOST;
console.log('Middleware Host:', middlewareHost); // Verificar que la variable se carga correctamente

document.getElementById('tokenizeForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const text = document.getElementById('textInput').value;
    try {
        const response = await fetch(`http://${middlewareHost}:3003/tokenize`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text })
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const result = await response.json();
        console.log('Tokenize result:', result); // Log para verificar la respuesta
        document.getElementById('result').innerText = `Token Count: ${result.tokenCount}`;
    } catch (error) {
        console.error('Error during tokenize:', error); // Log para verificar el error
        document.getElementById('result').innerText = `Error: ${error.message}`;
    }
});

document.getElementById('refreshInstances').addEventListener('click', async () => {
    try {
        const response = await fetch(`http://${middlewareHost}:3003/monitor`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const instances = await response.json();
        console.log('Instances:', instances); // Log para verificar la respuesta de instancias
        const logsResponse = await fetch(`http://${middlewareHost}:3003/logs`);
        if (!logsResponse.ok) {
            throw new Error('Network response was not ok');
        }
        const logs = await logsResponse.json();
        console.log('Logs:', logs); // Log para verificar la respuesta de logs

        const instancesList = document.getElementById('instancesList');
        instancesList.innerHTML = '';
        instances.forEach(instance => {
            const instanceLogs = logs.find(log => log.server === instance.url);
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <strong>IP:</strong> ${instance.url}<br>
                <strong>Requests:</strong> ${instance.requests}<br>
                <strong>Logs:</strong><br>
                <pre>${Array.isArray(instanceLogs.logs) ? instanceLogs.logs.join('\n') : instanceLogs.logs}</pre>
            `;
            instancesList.appendChild(listItem);
        });
    } catch (error) {
        console.error('Error during refresh instances:', error); // Log para verificar el error
        document.getElementById('instancesList').innerText = `Error: ${error.message}`;
    }
});