(function attachNumberOfDay(globalScope) {
  function createController({ flipRoot, spinButton, statusNode }) {
    let spinTimerIds = [];
    let isSpinning = false;

    function getNumberOfDayValue() {
      const now = new Date();
      return now.getDate();
    }

    function setFlipDigitText(node, digit) {
      if (!node) return;
      const textNode = node.querySelector('text');
      if (textNode) textNode.textContent = String(digit);
    }

    function flipDigitTo(digitNode, nextDigit, durationMs, delayMs = 0) {
      if (!digitNode) return;
      const currentDigit = Number(digitNode.dataset.digit || '0');
      const safeNextDigit = Number.isFinite(nextDigit) ? nextDigit : 0;

      const topStatic = digitNode.querySelector('.flip-static.top');
      const bottomStatic = digitNode.querySelector('.flip-static.bottom');
      const topFlap = digitNode.querySelector('.flip-flap.top');
      const bottomFlap = digitNode.querySelector('.flip-flap.bottom');

      setFlipDigitText(topStatic, currentDigit);
      setFlipDigitText(bottomStatic, safeNextDigit);
      setFlipDigitText(topFlap, currentDigit);
      setFlipDigitText(bottomFlap, safeNextDigit);

      const startFlip = () => {
        digitNode.style.setProperty('--flip-duration', `${durationMs}ms`);
        digitNode.classList.remove('is-flipping');
        void digitNode.offsetWidth;
        digitNode.classList.add('is-flipping');

        const finalizeTimer = window.setTimeout(() => {
          digitNode.classList.remove('is-flipping');
          digitNode.dataset.digit = String(safeNextDigit);
          setFlipDigitText(topStatic, safeNextDigit);
          setFlipDigitText(bottomStatic, safeNextDigit);
          setFlipDigitText(topFlap, safeNextDigit);
          setFlipDigitText(bottomFlap, safeNextDigit);
        }, durationMs + 56);

        spinTimerIds.push(finalizeTimer);
      };

      if (delayMs > 0) {
        const delayTimer = window.setTimeout(startFlip, delayMs);
        spinTimerIds.push(delayTimer);
      } else {
        startFlip();
      }
    }

    function setFlipClockNumber(value, durationMs = 220) {
      if (!flipRoot) return;
      const safeValue = Math.max(0, Number(value) || 0);
      const digits = String(safeValue).padStart(2, '0');
      const digitNodes = flipRoot.querySelectorAll('.flip-digit');

      digitNodes.forEach((digitNode, index) => {
        const staggerDelay = index * Math.min(90, Math.round(durationMs * 0.22));
        flipDigitTo(digitNode, Number(digits[index]), durationMs, staggerDelay);
      });
    }

    function clearTimers() {
      spinTimerIds.forEach((timerId) => window.clearTimeout(timerId));
      spinTimerIds = [];
    }

    function runFlip() {
      if (!flipRoot || isSpinning) return;

      isSpinning = true;
      clearTimers();
      if (spinButton) spinButton.disabled = true;
      if (statusNode) statusNode.textContent = 'Перелистываю табло...';

      const targetValue = getNumberOfDayValue();
      const rounds = 24;
      const baseValue = Math.floor(Math.random() * 30) + 1;
      let accumulatedDelay = 0;

      const runStep = (step) => {
        const nextValue = ((baseValue + step - 1) % 31) + 1;
        const progress = step / rounds;
        const delayMs = 52 + Math.round(18 * Math.pow(step, 1.18));
        const flipDuration = Math.max(120, Math.round(110 + progress * 210));
        setFlipClockNumber(nextValue, flipDuration);

        if (step === rounds) {
          if (statusNode) statusNode.textContent = `Число дня: ${String(targetValue).padStart(2, '0')}`;
          if (spinButton) spinButton.disabled = false;
          isSpinning = false;
        }
      };

      for (let step = 1; step <= rounds; step += 1) {
        accumulatedDelay += 48 + Math.round(16 * Math.pow(step, 1.16));
        const timerId = window.setTimeout(() => runStep(step), accumulatedDelay);
        spinTimerIds.push(timerId);
      }

      const settleTimer = window.setTimeout(() => {
        setFlipClockNumber(targetValue, 260);
      }, accumulatedDelay + 160);
      spinTimerIds.push(settleTimer);
    }

    function init() {
      setFlipClockNumber(getNumberOfDayValue(), 0);
    }

    return {
      init,
      runFlip,
      setFlipClockNumber,
      getNumberOfDayValue,
    };
  }

  globalScope.UrsasNumberOfDay = {
    createController,
  };
})(window);
