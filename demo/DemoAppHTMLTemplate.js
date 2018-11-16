// @flow

import React from 'react';

const STYLE_COLOR = {
  color: '#c40df2',
};

const STYLE_BOLD = {
  fontWeight: 'bold',
};

const STYLE_TEXT_ALIGN = {
  textAlign: 'right',
};

const STYLE_FONT_SIZE = {
  fontSize: '64px',
};

const STYLE_FONT_FAMILY = {
  fontFamily: 'Arial Black',
};

const STYLE_BACKGROUND_COLOR = {
  backgroundColor: '#e8e87d',
};

const STYLE_UNDERLINE = {
  textDecoration: 'underline',
};

const STYLE_FLOAT_LEFT = {
  cssFloat: 'left',
};

const STYLE_MIXED = {
  ...STYLE_BACKGROUND_COLOR,
  ...STYLE_BOLD,
  ...STYLE_COLOR,
  ...STYLE_FONT_FAMILY,
  ...STYLE_FONT_SIZE,
  ...STYLE_TEXT_ALIGN,
  ...STYLE_UNDERLINE,
};

class DemoAppHTMLTemplate extends React.PureComponent<any, any, any> {
  render(): React.Element<any> {
    return (
      <div className="demo-app-template">
        <h1>Maine coon. Tomcat cornish rex siamese for cheetah savannah</h1>
        <hr />
        <p style={{lineHeight: '200%'}}>
          <img src="https://placekitten.com/200/300" style={STYLE_FLOAT_LEFT} />
          Steal the warm chair right after
          <a href="https://github.com/chanzuckerberg/czi-prosemirror">
          you get up purr while eating claw at curtains stretch
          </a>
          and yawn nibble on tuna ignore human bite human hand for mark territory.
          <span style={STYLE_FONT_FAMILY}>
          Thinking longingly about tuna brine. Thug cat really likes hummus destroy the blinds stare at guinea
          </span>
          pigs. Warm up laptop with butt lick butt fart rainbows until owner yells pee in litter box hiss at cats eat a plant, kill a hand. Stare out the window touch my tail, i shred your hand purrrr lie in the sink all day suddenly go on wild-eyed crazy rampage.
          <span style={STYLE_COLOR}>face on everything.</span>
        </p>
        <ol>
          <li><span style={STYLE_COLOR}>Kitten norwegian forest</span></li>
          <li><span style={STYLE_BACKGROUND_COLOR}>Donskoy ragdoll and ragdoll</span></li>
          <li><b>Siberian tomcat.</b></li>
          <li><u>Burmese <i>lynx</i> and balinese</u></li>
        </ol>
        <p>
          The fat cat sat on
          <span style={STYLE_BACKGROUND_COLOR}>the mat bat away with</span>paws sweet beast, but this cat happen now, it was too purr-fect!!! or ears back wide eyed. Poop on grasses poop in litter box, scratch the walls. Murf pratt ungow ungow sit by the fire destroy couch as revenge yet mesmerizing birds more napping, more napping all the napping is exhausting. Present belly, scratch hand when stroked meow loudly just to annoy owners massacre a bird in the living room and then look like the cutest and most innocent animal on the planet my water bowl is clean and freshly replenished, so i'll drink from the toilet eat all the power cords, sit in a box for hours chase ball of string. Destroy couch claw at curtains stretch and yawn nibble on tuna ignore human bite human hand if it fits, i sits destroy house in 5 seconds stare out the window yet leave hair everywhere. With tail in the air lick butt, or lick the curtain just to be annoying, or destroy couch as revenge missing <a href="https://github.com/chanzuckerberg/czi-prosemirror">
            until dinner time destroy couch as revenge.
          </a>
        </p>
        <blockquote style={{textAlign: 'center'}}>
          Singapura bombay for norwegian forest tom tabby.
        </blockquote>
        <table>
          <colgroup>
            <col />
            <col style={{width: '300px'}} />
            <col />
          </colgroup>
          <thead>
            <tr>
              <th colSpan="3" style={{backgroundColor: '#7de8e8'}}>
                meow~~~~
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={STYLE_BACKGROUND_COLOR}>
                Singapura bombay for norwegian forest tom tabby. Leopard bengal egyptian mau cornish rex and singapura for maine coon or cheetah. Tomcat sphynx ocicat. Cornish rex devonshire rex bobcat and mouser or ocelot birman kitty. Panther balinese , for american bobtail abyssinian ocelot but leopard. Bobcat balinese ocelot, yet bobcat cheetah for bombay for cheetah. American shorthair persian. Bengal. Cougar panther and leopard bombay, bombay panther so british shorthair. Panther tiger so cougar for singapura, norwegian forest.
              </td>
              <td style={{backgroundColor: '#c8f442'}}>
                Maine coon. Tomcat cornish rex siamese for cheetah savannah. Cheetah havana brown mouser for scottish fold. Bengal leopard cornish rex turkish angora. Tomcat maine coon for malkin balinese , siberian or sphynx. Tom tomcat. Lion bobcat abyssinian . Norwegian forest ocicat yet siamese or malkin. Kitty balinese , but lynx so cheetah, mouser tom tom. Maine coon. Siberian bengal tabby lion or balinese yet manx. Thai savannah, russian blue. Donskoy ragdoll and ragdoll. Tiger kitten. Puma havana brown sphynx.
              </td>
              <td style={{backgroundColor: '#f441cd'}}>
                Siberian tomcat. Burmese lynx and balinese cornish rex tom. Kitten norwegian forest, for leopard so bombay leopard for kitten. American bobtail tabby savannah or tom. Birman tom. Sphynx american bobtail malkin yet scottish fold.
              </td>
            </tr>
            <tr>
              <td rowSpan="2" style={{backgroundColor: '#41f4d9'}}>
                111Singapura bombay for norwegian forest tom tabby.
              </td>
              <td colSpan="2">
                Burmese lynx and balinese cornish rex tom
              </td>
            </tr>
            <tr>
              <td style={STYLE_BACKGROUND_COLOR}>
                Singapura bombay for norwegian forest tom tabby.
              </td>
              <td>
                Siberian tomcat. Burmese lynx and balinese cornish rex tom. Kitten norwegian forest, for leopard so bombay leopard for kitten. American bobtail tabby savannah or tom. Birman tom. Sphynx american bobtail malkin yet scottish fold.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  }
}

export default DemoAppHTMLTemplate;
