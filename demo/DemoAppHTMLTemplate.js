// @flow

import React from 'react';

const STYLE_COLOR = {
  color: '#c40df2',
};

const STLE_BOLD = {
  fontWeight: 'bold',
};

const STYLE_BACKGROUND_COLOR = {
  backgroundColor: '#e8e87d',
};

const STYLE_MIXED = {
  ...STYLE_COLOR,
  ...STYLE_BACKGROUND_COLOR,
  ...STLE_BOLD,
};

class DemoAppHTMLTemplate extends React.PureComponent<any, any, any> {
  render(): React.Element<any> {
    return (
      <div className="demo-app-template">
        <h1>H1 Header</h1>
        <table>
          <tbody>
            <tr><th colSpan="3" data-colwidth="100,0,0">Wide header</th></tr>
            <tr><td>One</td><td>Two</td><td>Three</td></tr>
            <tr><td>Four</td><td>Five</td><td>Six</td></tr>
          </tbody>
        </table>
        <h3>H3 Header</h3>
        <p>
          It will be seen that this mere painstaking burrower and grub-worm of a
          poor devil of a Sub-Sub appears to have gone through the long Vaticans
          and street-stalls of the earth, picking up whatever random allusions to
          whales he could anyways find in any book whatsoever, sacred or profane.
          Therefore you must not, in every case at least, take the
          higgledy-piggledy whale statements, however authentic, in these
          extracts, for veritable gospel cetology. Far from it. As touching the
          ancient authors generally, as well as the poets here appearing, these
          extracts are solely valuable or entertaining, as affording a glancing
          bird&rsquo;s eye view of what has been promiscuously said, thought, fancied,
          and sung of Leviathan, by many nations and generations, including our
          own.
        </p>
        <p>
          So fare thee well, poor devil of a Sub-Sub, whose commentator I am. Thou
          belongest to that hopeless, sallow tribe which no wine of this world
          will ever warm; and for whom even Pale Sherry would be too rosy-strong;
          but with whom one sometimes loves to sit, and feel poor-devilish, too;
          and grow convivial upon tears; and say to them bluntly, with full eyes
          and empty glasses, and in not altogether unpleasant sadness&mdash;Give
          it up, Sub-Subs! For by how much the more pains ye take to please the
          world, by so much the more shall ye for ever go thankless! Would that I
          could clear out Hampton Court and the Tuileries for ye! But gulp down
          your tears and hie aloft to the royal-mast with your hearts; for your
          friends who have gone before are clearing out the seven-storied heavens,
          and making refugees of long-pampered Gabriel, Michael, and Raphael,
          against your coming. Here ye strike but splintered hearts together&mdash;there,
          ye shall strike unsplinterable glasses!
        </p>


        <img
          alt="cat pix"
          height="200"
          src="https://placekitten.com/200/200"
          width="200"
        />
        <hr />
        <img
          alt="cat pix"
          height="100"
          src="https://placekitten.com/200/100"
          width="200"
        />
        <ol>
          <li>
            AAAAA gendos. Nulla essent causae et per, in cibo
            sententiae est. Sit tamquam petentium an. Quo id p ersecuti
            dissentias,
            <a href="https://www.google.com/search?ei=RIboW4yPOOit0gLkkrDACw&q=the+quick+brown+fox+jumped+over+the+lazy+dog+alternatives&oq=quic_fox_jump_over&gs_l=psy-ab.1.0.0i71l8.0.0..5874...0.0..0.0.0.......0......gws-wiz.caqNmxUaqoY">
              cu sed diam prompta meliore, ne nominavi conv enire
            </a>
            principe AAAAA gendos. Nulla essent causae et per, in cibo
            sententiae est. Sit tamquam petentium an. Quo id p ersecuti
            dissentias, cu sed diam prompta meliore, ne nominavi conv enire
            principe
            AAAAA gendos. Nulla essent causae et per, in cibo
            sententiae est. Sit tamquam petentium an. Quo id p ersecuti
            dissentias, cu sed diam prompta meliore, ne nominavi conv enire
            principe
          </li>
          <li>BBB</li>
          <li>CCCCC</li>
          <li>DDDDDD</li>
        </ol>
        <h1>Editor Example</h1>
        <h2>H2 Header</h2>
        <p>
          Lorem ipsum dolor sit amet, phaedrum efficiantur pri cu, te quem
          <span style={STYLE_BACKGROUND_COLOR}>
            aliquando est. Viris aliquando definiebas duo et. Usu everti iriure
          </span>
          aliquando est. Viris aliquando definiebas duo et. Usu everti iriure
          <span style={STYLE_BACKGROUND_COLOR}>
            aliquando est. Viris aliquando definiebas duo et
            <span style={STYLE_COLOR}>
              aliquando est. Viris aliquando definiebas duo et. Usu everti iriure
            </span>
            sententiae est. Sit tamquam petentium an. Quo id p
            ersecuti dissentias, cu
          </span>
          aliquando est. Viris aliquando definiebas duo et. Usu everti iriure
          <span style={STYLE_MIXED}>
            With Background Color and Text Color
          </span>
        </p>
        <p>
          posidonium in. Te mea nonumes detracto legendos. Nulla essent causae
          et per, in cibo sententiae est. Sit tamquam petentium an. Quo id p
          ersecuti dissentias, cu sed diam prompta meliore, ne nominavi conv
          enire principes pro.
        </p>
        <ul start="10">
          <li>KKK</li>
          <li>GGG</li>
          <li>PPP</li>
          <li>QQQQQ</li>
        </ul>
        <ol start="6">
          <li>Item A</li>
          <li>Item B</li>
          <li>Item C</li>
          <li>Item D</li>
        </ol>
      </div>
    )
  }
}

export default DemoAppHTMLTemplate;
