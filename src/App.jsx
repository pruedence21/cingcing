import React, { useState } from 'react';
    import { format, isSameDay } from 'date-fns';
    import { caretakers } from './data/caretakers';
    import './index.css';

    const App = () => {
      const [largePets, setLargePets] = useState(0);
      const [smallPets, setSmallPets] = useState(0);
      const [selectedCaretaker, setSelectedCaretaker] = useState(caretakers[0].id);
      const [date, setDate] = useState(new Date());
      const [history, setHistory] = useState([]);
      const [error, setError] = useState('');

      const isDateExists = (newDate) => {
        return history.some(entry => 
          isSameDay(new Date(entry.date), newDate)
        );
      };

      const calculateIncome = () => {
        const largePetIncome = largePets * 50000;
        const smallPetIncome = smallPets * 30000;
        const totalPets = largePets + smallPets;
        
        const caretaker = caretakers.find(c => c.id === selectedCaretaker);
        let hennyIncome = 0;
        let anggiIncome = 0;

        if (caretaker.id === 'henny') {
          hennyIncome = totalPets * caretaker.feePerPet;
        } else if (caretaker.id === 'anggi') {
          anggiIncome = totalPets * caretaker.feePerPet;
        } else {
          hennyIncome = totalPets * caretaker.feePerPet;
          anggiIncome = totalPets * caretaker.feePerPet;
        }

        const totalEmployeeIncome = hennyIncome + anggiIncome;
        const totalIncome = largePetIncome + smallPetIncome + totalEmployeeIncome;

        return {
          largePetIncome,
          smallPetIncome,
          hennyIncome,
          anggiIncome,
          totalEmployeeIncome,
          totalIncome
        };
      };

      const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        const formattedDate = format(date, 'yyyy-MM-dd');
        const newDate = new Date(formattedDate);

        if (isDateExists(newDate)) {
          setError('Tanggal ini sudah ada di riwayat!');
          return;
        }

        const income = calculateIncome();
        const caretaker = caretakers.find(c => c.id === selectedCaretaker);
        
        const newEntry = {
          date: formattedDate,
          largePets,
          smallPets,
          caretaker: caretaker.name,
          ...income
        };
        
        setHistory([...history, newEntry]);
        // Hapus reset jumlah hewan
        setSelectedCaretaker(caretakers[0].id);
        setDate(new Date());
      };

      const { largePetIncome, smallPetIncome, hennyIncome, anggiIncome, totalEmployeeIncome, totalIncome } = calculateIncome();

      // Calculate total income for all history
      const totalHennyIncome = history.reduce((sum, entry) => sum + entry.hennyIncome, 0);
      const totalAnggiIncome = history.reduce((sum, entry) => sum + entry.anggiIncome, 0);

      return (
        <div className="container">
          <h1>Kalkulator Pendapatan Penitipan Hewan</h1>
          
          <form onSubmit={handleSubmit}>
            {error && <div className="error-message">{error}</div>}

            <div className="input-group">
              <label>Tanggal:</label>
              <input
                type="date"
                value={format(date, 'yyyy-MM-dd')}
                onChange={(e) => {
                  setDate(new Date(e.target.value));
                  setError('');
                }}
                required
              />
            </div>

            <div className="input-group">
              <label>Jumlah Hewan Besar:</label>
              <input
                type="number"
                value={largePets}
                onChange={(e) => setLargePets(Number(e.target.value))}
                min="0"
                required
              />
            </div>

            <div className="input-group">
              <label>Jumlah Hewan Kecil:</label>
              <input
                type="number"
                value={smallPets}
                onChange={(e) => setSmallPets(Number(e.target.value))}
                min="0"
                required
              />
            </div>

            <div className="input-group">
              <label>Pengurus:</label>
              <select
                value={selectedCaretaker}
                onChange={(e) => setSelectedCaretaker(e.target.value)}
              >
                {caretakers.map(caretaker => (
                  <option key={caretaker.id} value={caretaker.id}>
                    {caretaker.name}
                  </option>
                ))}
              </select>
            </div>

            <button type="submit">Simpan Perhitungan</button>
          </form>

          <div className="result">
            <h2>Rincian Pendapatan</h2>
            <p>Pendapatan Hewan Besar: <strong>Rp{largePetIncome.toLocaleString()}</strong></p>
            <p>Pendapatan Hewan Kecil: <strong>Rp{smallPetIncome.toLocaleString()}</strong></p>
            <p>Pendapatan Henny: <strong>Rp{hennyIncome.toLocaleString()}</strong></p>
            <p>Pendapatan Anggi: <strong>Rp{anggiIncome.toLocaleString()}</strong></p>
            <p>Total Pendapatan Pengurus: <strong>Rp{totalEmployeeIncome.toLocaleString()}</strong></p>
            <p>Total Pendapatan: <strong>Rp{totalIncome.toLocaleString()}</strong></p>
          </div>

          <div className="history">
            <h2>Riwayat Perhitungan</h2>
            <div style={{ overflowX: 'auto' }}>
              <table>
                <thead>
                  <tr>
                    <th>Tanggal</th>
                    <th>Hewan Besar</th>
                    <th>Hewan Kecil</th>
                    <th>Pengurus</th>
                    <th>Pendapatan Henny</th>
                    <th>Pendapatan Anggi</th>
                    <th>Total Pendapatan</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((entry, index) => (
                    <tr key={index}>
                      <td>{entry.date}</td>
                      <td>{entry.largePets}</td>
                      <td>{entry.smallPets}</td>
                      <td>{entry.caretaker}</td>
                      <td>Rp{entry.hennyIncome.toLocaleString()}</td>
                      <td>Rp{entry.anggiIncome.toLocaleString()}</td>
                      <td>Rp{entry.totalIncome.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="4"><strong>Total</strong></td>
                    <td><strong>Rp{totalHennyIncome.toLocaleString()}</strong></td>
                    <td><strong>Rp{totalAnggiIncome.toLocaleString()}</strong></td>
                    <td><strong>Rp{history.reduce((sum, entry) => sum + entry.totalIncome, 0).toLocaleString()}</strong></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      );
    };

    export default App;
