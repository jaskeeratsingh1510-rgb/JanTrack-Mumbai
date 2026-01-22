
// Native fetch is available in Node 22

async function verify() {
    try {
        const res = await fetch('http://localhost:5000/api/candidates');
        const data = await res.json();
        console.log(`API returned ${Array.isArray(data) ? data.length : 'invalid'} candidates.`);
        if (Array.isArray(data) && data.length > 0) {
            console.log('Sample Name:', data[0].name);
        }
    } catch (e) {
        console.error('Fetch failed:', e.message);
    }
}
verify();
