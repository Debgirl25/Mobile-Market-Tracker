
let entries = [];
let currentLocation = { lat: '', lon: '' };

function getLocation() {
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      currentLocation.lat = pos.coords.latitude;
      currentLocation.lon = pos.coords.longitude;
      alert('Location captured!');
    },
    (err) => {
      alert('Location not available');
    }
  );
}

function addEntry() {
  const form = document.forms['trackerForm'];
  const entry = {
    age_0_4: parseInt(form.age_0_4.value || 0),
    age_5_17: parseInt(form.age_5_17.value || 0),
    age_18_59: parseInt(form.age_18_59.value || 0),
    age_60_plus: parseInt(form.age_60_plus.value || 0),
    isNew: form.isNew.value,
    remarks: form.remarks.value,
    timestamp: new Date().toISOString(),
    lat: currentLocation.lat,
    lon: currentLocation.lon,
  };
  entries.push(entry);
  form.reset();
  displayTotals();
}

function displayTotals() {
  const totals = entries.reduce((acc, e) => {
    acc.age_0_4 += e.age_0_4;
    acc.age_5_17 += e.age_5_17;
    acc.age_18_59 += e.age_18_59;
    acc.age_60_plus += e.age_60_plus;
    e.isNew === 'yes' ? acc.newFamilies++ : acc.returningFamilies++;
    return acc;
  }, { age_0_4: 0, age_5_17: 0, age_18_59: 0, age_60_plus: 0, newFamilies: 0, returningFamilies: 0 });

  document.getElementById('totals').innerHTML = `
    <strong>Totals:</strong><br/>
    Ages 0–4: ${totals.age_0_4}<br/>
    Ages 5–17: ${totals.age_5_17}<br/>
    Ages 18–59: ${totals.age_18_59}<br/>
    Ages 60+: ${totals.age_60_plus}<br/>
    New Families: ${totals.newFamilies}<br/>
    Returning Families: ${totals.returningFamilies}
  `;
}

function exportCSV() {
  const headers = ['Ages 0–4','Ages 5–17','Ages 18–59','Ages 60+','New Family','Remarks','Timestamp','Latitude','Longitude'];
  const rows = entries.map(e => [e.age_0_4, e.age_5_17, e.age_18_59, e.age_60_plus, e.isNew, `"${e.remarks}"`, e.timestamp, e.lat, e.lon]);
  const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'mobile_market_data.csv';
  a.click();
}
