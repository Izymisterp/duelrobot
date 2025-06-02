import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

// Fonction utilitaire
const rollDice = () => Math.floor(Math.random() * 100) + 1;

// Composant configuration des armes
const WeaponSetup = ({ weapons, setWeapons, onStart }) => {
  const handleChange = (index, key, value) => {
    const updated = [...weapons];
    updated[index][key] = Number(value);
    setWeapons(updated);
  };

  return (
    <div className="p-6 w-full max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Configurer les armes</h2>
      {weapons.map((weapon, index) => (
        <Card key={index} className="mb-4 p-4">
          <CardContent className="space-y-2">
            <h3 className="font-semibold text-lg">{weapon.name}</h3>
            <div className="flex gap-4 items-center">
              <label className="w-32">Dégâts max :</label>
              <Input
                type="number"
                value={weapon.damage}
                onChange={(e) => handleChange(index, "damage", e.target.value)}
              />
            </div>
            <div className="flex gap-4 items-center">
              <label className="w-32">Précision (%) :</label>
              <Input
                type="number"
                value={weapon.accuracy}
                onChange={(e) =>
                  handleChange(index, "accuracy", e.target.value)
                }
              />
            </div>
          </CardContent>
        </Card>
      ))}
      <Button onClick={onStart} className="mt-4">
        Démarrer la partie
      </Button>
    </div>
  );
};

// Composant Robot
const Robot = ({ name, health, onAttack, isDead, weapons }) => {
  return (
    <Card className="w-full max-w-md shadow-xl rounded-2xl p-4 m-4 bg-white">
      <CardContent className="text-center">
        <h2 className="text-xl font-bold mb-2">{name}</h2>
        <p className={`text-lg ${isDead ? "text-red-500" : ""}`}>
          PV : {health}
        </p>
        <div className="flex flex-wrap justify-center gap-2 mt-4">
          {weapons.map((weapon) => (
            <Button
              key={weapon.name}
              onClick={() => onAttack(weapon)}
              disabled={isDead}
              className="px-4 py-2 text-sm"
            >
              {weapon.name}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// Composant principal
export default function Game() {
  const [robot1Health, setRobot1Health] = useState(100);
  const [robot2Health, setRobot2Health] = useState(100);
  const [logs, setLogs] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);

  // Valeurs par défaut des armes
  const [weapons, setWeapons] = useState([
    { name: "Laser", damage: 20, accuracy: 70 },
    { name: "Missile", damage: 30, accuracy: 50 },
    { name: "Canon Plasma", damage: 25, accuracy: 60 },
  ]);

  const handleAttack = (attacker, target, setTargetHealth, weapon) => {
    if (target <= 0 || attacker <= 0) return;

    const hitRoll = rollDice();
    const hit = hitRoll <= weapon.accuracy;

    let logMessage = `${weapon.name} utilisé : `;
    if (hit) {
      setTargetHealth((prev) => Math.max(prev - weapon.damage, 0));
      logMessage += `TOUCHE (${hitRoll} ≤ ${weapon.accuracy}) ! ${weapon.damage} dégâts.`;
    } else {
      logMessage += `RATE (${hitRoll} > ${weapon.accuracy}).`;
    }

    setLogs((prevLogs) => [logMessage, ...prevLogs]);
  };

  if (!gameStarted) {
    return (
      <WeaponSetup
        weapons={weapons}
        setWeapons={setWeapons}
        onStart={() => {
          setRobot1Health(100);
          setRobot2Health(100);
          setLogs([]);
          setGameStarted(true);
        }}
      />
    );
  }

  return (
    <div className="flex flex-col items-center space-y-6 p-6">
      <h1 className="text-2xl font-bold">Combat de Robots</h1>

      <div className="flex flex-wrap justify-center gap-6">
        <Robot
          name="Robot Alpha"
          health={robot1Health}
          isDead={robot1Health <= 0}
          weapons={weapons}
          onAttack={(weapon) =>
            handleAttack(robot1Health, robot2Health, setRobot2Health, weapon)
          }
        />
        <Robot
          name="Robot Bêta"
          health={robot2Health}
          isDead={robot2Health <= 0}
          weapons={weapons}
          onAttack={(weapon) =>
            handleAttack(robot2Health, robot1Health, setRobot1Health, weapon)
          }
        />
      </div>

      {(robot1Health <= 0 || robot2Health <= 0) && (
        <div className="text-xl font-semibold text-red-600">
          {robot1Health <= 0 && "Robot Alpha est détruit !"}
          {robot2Health <= 0 && "Robot Bêta est détruit !"}
        </div>
      )}

      <div className="mt-8 w-full max-w-2xl">
        <h2 className="text-lg font-bold mb-2">Historique des attaques</h2>
        <div className="bg-gray-100 p-3 rounded-lg h-40 overflow-y-scroll text-sm font-mono">
          {logs.length === 0 && <p>Aucune attaque pour l’instant.</p>}
          {logs.map((log, index) => (
            <p key={index}>➤ {log}</p>
          ))}
        </div>
      </div>
    </div>
  );
}
