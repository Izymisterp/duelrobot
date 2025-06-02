import { useState, useEffect } from 'react';
import './App.css';

type Weapon = {
  name: string;
  maxDamage: number;
};

type Robot = {
  name: string;
  weapons: Weapon[];
  health: number;
};

export default function App() {
  const [nombreArmes, setNombreArmes] = useState(3);

  const baseWeapons = [
    { name: 'Laser', maxDamage: 20 },
    { name: 'Missile', maxDamage: 30 },
    { name: 'Plasma', maxDamage: 25 },
    { name: 'Canon', maxDamage: 25 },
    { name: 'Électrochoc', maxDamage: 15 },
    { name: 'Rayon Gamma', maxDamage: 35 }
  ];

  const construireRobots = () => [
    {
      name: 'Robot A',
      weapons: baseWeapons.slice(0, nombreArmes),
      health: 100
    },
    {
      name: 'Robot B',
      weapons: baseWeapons.slice(3, 3 + nombreArmes),
      health: 100
    }
  ];

  const [robots, setRobots] = useState<Robot[]>(construireRobots());
  const [selectedWeaponIndex, setSelectedWeaponIndex] = useState<number[]>([0, 0]);
  const [message, setMessage] = useState('');
  const [turn, setTurn] = useState<0 | 1>(0);
  const [historique, setHistorique] = useState<string[]>([]);

  // Met à jour les robots si le nombre d'armes change
  useEffect(() => {
    setRobots(construireRobots());
    setSelectedWeaponIndex([0, 0]);
    setMessage('');
    setHistorique([]);
    setTurn(0);
  }, [nombreArmes]);

  const lancerDe = (faces: number = 6) => Math.floor(Math.random() * faces) + 1;

  const attaquer = () => {
    const attaquant = turn;
    const defenseur = turn === 0 ? 1 : 0;
    const weapon = robots[attaquant].weapons[selectedWeaponIndex[attaquant]];

    const touche = lancerDe();

    if (touche < 4) {
      const missMsg = `${robots[attaquant].name} a raté avec ${weapon.name}.`;
      setMessage(missMsg);
      setHistorique((h) => [missMsg, ...h]);
    } else {
      const degats = lancerDe(weapon.maxDamage);
      const nouvelleVie = Math.max(0, robots[defenseur].health - degats);

      const nouveauxRobots = [...robots];
      nouveauxRobots[defenseur] = {
        ...robots[defenseur],
        health: nouvelleVie,
      };
      setRobots(nouveauxRobots);

      const hitMsg = `${robots[attaquant].name} a touché ${robots[defenseur].name} avec ${weapon.name} pour ${degats} points de dégâts !`;
      setMessage(hitMsg);
      setHistorique((h) => [hitMsg, ...h]);
    }

    setTurn(defenseur as 0 | 1);
  };

  const changerArme = (joueur: number, index: number) => {
    const nouveauChoix = [...selectedWeaponIndex];
    nouveauChoix[joueur] = index;
    setSelectedWeaponIndex(nouveauChoix);
  };

  const changerNomRobot = (index: number, nouveauNom: string) => {
    const r = [...robots];
    r[index].name = nouveauNom;
    setRobots(r);
  };

  const changerNomArme = (robotIndex: number, weaponIndex: number, nom: string) => {
    const r = [...robots];
    r[robotIndex].weapons[weaponIndex].name = nom;
    setRobots(r);
  };

  const recommencer = () => {
    setRobots(construireRobots());
    setSelectedWeaponIndex([0, 0]);
    setMessage('');
    setHistorique([]);
    setTurn(0);
  };

  return (
    <div className="App" style={{ fontFamily: 'Arial, sans-serif', padding: '20px', backgroundColor: '#f0f4f8' }}>
      <h1 style={{ textAlign: 'center', color: '#2b2d42' }}>🤖 Duel de Robots 🤖</h1>

      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h3>Choisissez le nombre d'armes par robot :</h3>
        {[1, 2, 3].map((nombre) => (
          <label key={nombre} style={{ margin: '0 10px' }}>
            <input
              type="radio"
              value={nombre}
              checked={nombreArmes === nombre}
              onChange={() => setNombreArmes(nombre)}
            />
            {nombre} arme(s)
          </label>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '2rem' }}>
        {robots.map((robot, i) => (
          <div
            key={i}
            style={{
              background: '#ffffff',
              borderRadius: '15px',
              padding: '20px',
              width: '45%',
              boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
            }}
          >
            <h2>
              <input
                type="text"
                value={robot.name}
                onChange={(e) => changerNomRobot(i, e.target.value)}
                style={{ fontSize: '1.2rem', padding: '5px', width: '100%' }}
              />
            </h2>
            <p style={{ fontWeight: 'bold', color: '#ef233c' }}>❤️ {robot.health} PV</p>
            <p style={{ marginTop: '1rem', fontWeight: 'bold' }}>🔫 Choix de l'arme :</p>
            {robot.weapons.map((w, j) => (
              <div key={j} style={{ marginBottom: '8px' }}>
                <input
                  type="radio"
                  name={`weapon-${i}`}
                  value={j}
                  checked={selectedWeaponIndex[i] === j}
                  onChange={() => changerArme(i, j)}
                  disabled={turn !== i || robot.health === 0}
                />
                <input
                  type="text"
                  value={w.name}
                  onChange={(e) => changerNomArme(i, j, e.target.value)}
                  style={{ marginLeft: '8px', padding: '3px' }}
                />
                <span style={{ marginLeft: '5px', color: '#555' }}>(max {w.maxDamage} pts)</span>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center' }}>
        <button
          onClick={attaquer}
          disabled={robots.some(r => r.health === 0)}
          style={{ padding: '10px 20px', fontSize: '1rem', backgroundColor: '#2b2d42', color: 'white', border: 'none', borderRadius: '8px' }}
        >
          ⚔️ Attaquer ({robots[turn].name})
        </button>

        <button
          onClick={recommencer}
          style={{ marginLeft: '1rem', padding: '10px 20px', fontSize: '1rem', backgroundColor: '#8d99ae', color: 'white', border: 'none', borderRadius: '8px' }}
        >
          🔁 Recommencer
        </button>

        <p style={{ marginTop: '1rem', fontStyle: 'italic' }}>{message}</p>

        {robots.some(r => r.health === 0) && (
          <h2 style={{ color: '#2b9348' }}>🎉 {robots.find(r => r.health > 0)?.name} a gagné !</h2>
        )}
      </div>

      <div style={{ marginTop: '2rem', background: '#edf2f4', padding: '15px', borderRadius: '10px' }}>
        <h3>📜 Historique des attaques</h3>
        <ul>
          {historique.map((entry, i) => (
            <li key={i} style={{ marginBottom: '5px' }}>{entry}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
