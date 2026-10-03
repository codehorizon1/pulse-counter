import { useEffect, useState } from "react";
import "./App.css";

function App() {
  
  const [activity, setActivity] = useState(() => {
    return localStorage.getItem("pulse-activity") || "Coding Problems";
  });

  const [count, setCount] = useState(() => {
    const savedCount = localStorage.getItem("pulse-count");

    return savedCount !== null
      ? Number(savedCount)
      : 0;
  });

  const [goal, setGoal] = useState(() => {
    const savedGoal = localStorage.getItem("pulse-goal");

    return savedGoal !== null
      ? Number(savedGoal)
      : 10;
  });

  const [goalInput, setGoalInput] = useState(() => {
    return localStorage.getItem("pulse-goal") || "10";
  });

  const [action, setAction] = useState("idle");


  useEffect(() => {
    localStorage.setItem(
      "pulse-activity",
      activity
    );
  }, [activity]);


  useEffect(() => {
    localStorage.setItem(
      "pulse-count",
      count
    );
  }, [count]);


  useEffect(() => {
    localStorage.setItem(
      "pulse-goal",
      goal
    );
  }, [goal]);


  const handleActivityChange = (event) => {
    setActivity(event.target.value);
  };

  const handleGoalChange = (event) => {
    const value = event.target.value;

    setGoalInput(value);

    // Allow the user to temporarily clear
    // the input while typing.
    if (value === "") {
      return;
    }

    const newGoal = Number(value);

    // Only allow positive whole numbers.
    if (
      !Number.isInteger(newGoal) ||
      newGoal < 1
    ) {
      return;
    }

    setGoal(newGoal);

    // If the new goal is smaller than
    // the current count, reduce count
    // automatically.
    setCount((previousCount) =>
      Math.min(previousCount, newGoal)
    );

    setAction("goal");
  };


  const handleGoalBlur = () => {
    if (goalInput === "") {
      setGoalInput("1");

      setGoal(1);

      setCount((previousCount) =>
        Math.min(previousCount, 1)
      );

      setAction("goal");
    }
  };


  const increment = () => {
    setCount((previousCount) =>
      previousCount < goal
        ? previousCount + 1
        : previousCount
    );

    setAction("increase");
  };


  const decrement = () => {
    setCount((previousCount) =>
      previousCount > 0
        ? previousCount - 1
        : 0
    );

    setAction("decrease");
  };

  const reset = () => {
    setCount(0);

    setAction("reset");
  };


  useEffect(() => {
    const handleKeyDown = (event) => {

      // Don't trigger keyboard shortcuts
      // while typing inside an input.
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        event.target instanceof HTMLSelectElement
      ) {
        return;
      }


      // Prevent page scrolling
      // with ArrowUp / ArrowDown.
      if (
        event.key === "ArrowUp" ||
        event.key === "ArrowDown"
      ) {
        event.preventDefault();
      }


      // Increase
      if (
        event.key === "ArrowUp" ||
        event.key === "+"
      ) {
        increment();
      }


      // Decrease
      if (
        event.key === "ArrowDown" ||
        event.key === "-"
      ) {
        decrement();
      }


      // Reset
      if (
        event.key.toLowerCase() === "r"
      ) {
        reset();
      }
    };


    window.addEventListener(
      "keydown",
      handleKeyDown
    );


    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };

  }, [goal]);


  const progress =
    goal > 0
      ? Math.min((count / goal) * 100, 100)
      : 0;


  const remaining =
    Math.max(goal - count, 0);


  const isCompleted =
    count >= goal;

  return (
    <main className={`app ${action}`}>
      <div className="ambient ambient-one"></div>

      <div className="ambient ambient-two"></div>

      <section className="counter-card">
        <header className="counter-header">

          <p className="eyebrow">
            PULSE
          </p>

          <h1>
            Goal Progress
          </h1>

          <p className="description">
            Turn small actions into measurable progress.
          </p>

        </header>

        <div className="activity-section">

          <label
            className="activity-label"
            htmlFor="activity"
          >
            WHAT ARE YOU TRACKING?
          </label>

          <input
            id="activity"
            className="activity-input"
            type="text"
            value={activity}
            onChange={handleActivityChange}
            placeholder="e.g. Coding Problems"
            maxLength="40"
          />

        </div>


        <div className="goal-section">

          <span className="goal-label">
            CURRENT GOAL
          </span>

          <input
            className="goal-input"
            type="number"
            min="1"
            step="1"
            value={goalInput}
            onChange={handleGoalChange}
            onBlur={handleGoalBlur}
            aria-label="Current goal"
          />

        </div>


        <div className="counter-area">

          <div
            className={`counter-display ${action}`}
            style={{
              "--progress": `${progress}%`,
            }}
          >

            <div className="pulse-wave"></div>

            <div className="counter-ring"></div>

            <div className="counter-number">
              {count}
            </div>

          </div>


          {/* Progress */}

          <div className="progress-text">

            <span>
              {count}
            </span>

            <span className="progress-divider">
              /
            </span>

            <span>
              {goal}
            </span>

          </div>


          {/* Status */}

          <div
            className={`status-message ${
              isCompleted ? "completed" : ""
            }`}
          >

            <span className="status-icon">
              {isCompleted ? "✓" : "●"}
            </span>

            <span>
              {isCompleted
                ? `${activity} completed`
                : `${remaining} remaining`}
            </span>

          </div>

        </div>



        <div className="controls">

          <button
            className="control-button decrease"
            onClick={decrement}
            type="button"
          >

            <span className="button-icon">
              −
            </span>

            <span>
              Decrease
            </span>

          </button>


          <button
            className="control-button reset"
            onClick={reset}
            type="button"
          >
            Reset
          </button>


          <button
            className="control-button increase"
            onClick={increment}
            type="button"
          >

            <span>
              Increase
            </span>

            <span className="button-icon">
              +
            </span>

          </button>

        </div>



        <div className="progress-percentage">

          <span>
            {Math.round(progress)}%
          </span>

          <span>
            COMPLETE
          </span>

        </div>


        <div className="keyboard-controls">

          <p className="keyboard-title">
            KEYBOARD CONTROLS
          </p>

          <div className="keyboard-hints">

            <div className="keyboard-hint">
              <kbd>↑</kbd>
              <span>Increase</span>
            </div>

            <div className="keyboard-hint">
              <kbd>↓</kbd>
              <span>Decrease</span>
            </div>

            <div className="keyboard-hint">
              <kbd>R</kbd>
              <span>Reset</span>
            </div>

          </div>

        </div>

        <footer className="system-status">

          <span className="status-dot"></span>

          <span>
            {isCompleted
              ? "Goal reached"
              : `Tracking • ${count} / ${goal}`}
          </span>

        </footer>

      </section>

    </main>
  );
}

export default App;