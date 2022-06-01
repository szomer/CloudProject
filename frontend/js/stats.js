function loadStats() {
    let response;
    let table = document.getElementById('table-contents');
    try {
        fetch('/api/stats', {
            method: 'get',
            headers: { 'Content-Type': 'application/json' }
        }).then(async (res) => {
            response = await res.json();
            table.innerHTML = "<th>Weight</th>" +
                "<th>Height</th>" +
                "<th>BMI</th>";

            for (let result of response.results) {
                table.innerHTML = table.innerHTML +
                    `<tr><td>${result.weight}</td>` +
                    `<td>${result.height}</td>` +
                    `<td>${result.bmi}</td></tr>`;
            }

        });
    } catch (ignore) {
        console.log("api/stats Error");
        console.log(ignore);
    }
}
document.addEventListener("readystatechange", loadStats);
