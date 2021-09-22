import * as React from "react";
import styled from "@emotion/styled";
import { motion } from "framer-motion";

const Track = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  background: #f2f4f3;
  height: 200px;
  width: 100%;
`;

const Horse = styled.img`
  &::after {
    content: ${(props) => props.index};
  }
`;

const RaceTrack = ({ winner, data }) => {
  if (isNaN(winner)) {
    return null;
  }

  function calculateHighestFitnessToWin() {
    const fitnessArray = data.map((d) => d.fitness);
    const highestFitness = Math.min.apply(0, fitnessArray);
    return highestFitness - 1 || 0; // a little bit faster
  }

  return (
    <Track>
      {data.map((horseMetadata, index) => (
        <motion.div
          animate={{ x: document.body.clientWidth - 100 }}
          transition={{
            duration:
              index === winner
                ? calculateHighestFitnessToWin()
                : horseMetadata.fitness,
          }}
        >
          <Horse src={horseMetadata.image} alt={index} index={index} />
        </motion.div>
      ))}
    </Track>
  );
};

export default RaceTrack;
