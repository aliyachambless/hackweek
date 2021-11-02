import styled from 'styled-components'


const Grid = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: start;
  font-family: 'ThunderBlack';
  font-size: 7em;
  line-height: 0.74em;
  color: #ff7777;

  @media (max-width: 425px) {
    grid-template-columns: 1fr;
  }
`

const Left = styled.div`
  position: relative;
  display: grid;
  grid-template-rows: 1fr auto;
  width: 100%;
  height: 100%;
  padding: 100px;
  white-space: nowrap;
  line-height: 1em;
  font-family: 'Ladi Gross';
  @media (max-width: 768px) {
    padding: 50px;
  }
`

const Right = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  height: 100%;
  background: #ff7777;
  color: #252525;
  font-family: 'Work Sans', cursive;
  
`

const Sub = styled.div`
  align-self: end;
  width: 200px;
  height: 2px;
  background: #ff7777;
`

const Jumbo = styled.div`
  align-self: center;
  padding: 100px;
  font-size: 3.5em;
  color: #252525;
`

export default function Underlay() {
  return (
    <Grid>
      <Left>
        <div>
          WHY DO WE
          <br />
          HAVE SO 
          <br />
          MANY TEETH
          <br />
          AND SO
          <br />
          LITTLE TIME
        </div>
        <Sub />
      </Left>
      <Right>
        <Jumbo>32</Jumbo>
      </Right>
    </Grid>
  )
}
