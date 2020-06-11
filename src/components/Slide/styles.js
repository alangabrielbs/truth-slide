import styled from 'styled-components';

export const ContainerEl = styled.div`
  overflow: hidden;
`;

export const WrapperEl = styled.div`
  display: flex;

  :hover {
    will-change: transform, rigth, left;
  }

  .truth-slide {
    flex-shrink: 0;
    overflow: hidden;
    transform: scale(0.7);
    transition: 0.4s;
    opacity: 0.4;
    position: relative;
    z-index: 0;

    &.active-slide {
      opacity: 1;
      transform: scale(1);
      z-index: 5;
    }
  }

  /* .prev-slide {
    transform: translate3d(500px, 0px, 0px) scale(0.8);
  }

  .next-slide {
    transform: translate3d(-500px, 0px, 0px) scale(0.8);
  } */
`;
