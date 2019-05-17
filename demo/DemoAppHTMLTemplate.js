// @flow

import React from 'react';

const STYLE_COLOR = {
  color: '#c40df2',
};

// const STYLE_BOLD = {
//   fontWeight: 'bold',
// };

// const STYLE_TEXT_ALIGN = {
//   textAlign: 'right',
// };

// const STYLE_FONT_SIZE = {
//   fontSize: '64px',
// };

const STYLE_FONT_FAMILY = {
  fontFamily: 'Arial Black',
};

const STYLE_BACKGROUND_COLOR = {
  backgroundColor: '#e8e87d',
};

// const STYLE_UNDERLINE = {
//   textDecoration: 'underline',
// };

const STYLE_FLOAT_LEFT = {
  cssFloat: 'left',
};

// const STYLE_MIXED = {
//   ...STYLE_BACKGROUND_COLOR,
//   ...STYLE_BOLD,
//   ...STYLE_COLOR,
//   ...STYLE_FONT_FAMILY,
//   ...STYLE_FONT_SIZE,
//   ...STYLE_TEXT_ALIGN,
//   ...STYLE_UNDERLINE,
// };

class DemoAppHTMLTemplate extends React.PureComponent<any, any, any> {
  render() {
    const ols = new Array(7).fill(0).map((_, ii) => {
      return (
        <ol data-indent={ii} key={`ol_${ii}`} start={100 + ii}>
          <li>
            quick fox jumps over the lazy dog quick fox jumps over the lazy dog
            quick fox jumps over the lazy dog quick fox jumps over the lazy dog
            quick fox jumps over the lazy dog
          </li>
          <li>
            quick fox jumps over the lazy dog quick fox jumps over the lazy dog
          </li>
        </ol>
      );
    });
    const uls = new Array(7).fill(0).map((_, ii) => {
      return (
        <ul data-indent={ii} key={`ol_${ii}`}>
          <li>
            assasad ssasadx ssasadx ssasadx ssasadx ssasadx ssasadx ssasadx
            ssasadx ssasadx ssasadx ssasadx ssasadx ssasadx ssasadx ssasadx
            ssasadx ssasadx ssasadx ssasadx ssasadx ssasadx ssasadx ssasadx
            ssasadx ssasadx ssasadx ssasadx ssasadx
          </li>
          <li>assasad</li>
          <li>assasad</li>
          <li>assasad</li>
        </ul>
      );
    });
    return (
      <div>
        {ols}
        {uls}
      </div>
    );
  }
  renderx(): React.Element<any> {
    return (
      <div style={{display: 'none'}}>
        <h1>At vero eos et accusamus et iusto odio dignissimos duc</h1>
        <ol>
          <li>
            <span style={STYLE_COLOR}>
              rum quidem rerum facilis est et expedita distinctio. Nam libero
              tempore{' '}
            </span>
          </li>
          <li>
            <span style={STYLE_BACKGROUND_COLOR}>
              {' '}
              minus id quod maxime placeat facere possim
            </span>
          </li>
          <li>
            <b>nis voluptas assumenda</b>
          </li>
          <li>
            <u>
              uuntur magni dolores <i>lynx</i> auuntur magni doloresalinese
            </u>
          </li>
        </ol>
        <table>
          <colgroup>
            <col />
            <col style={{width: '300px'}} />
            <col />
          </colgroup>
          <thead>
            <tr>
              <th colSpan="3" style={{backgroundColor: '#7de8e8'}}>
                us qui blanditiis praesentium voluptatum deleniti atqu
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={STYLE_BACKGROUND_COLOR}>
                us qui blanditiis praesentium voluptatum deleniti atqu us qui
                blanditiis praesentium voluptatum deleniti atqu us qui
                blanditiis praesentium voluptatum deleniti atqu
              </td>
              <td style={{backgroundColor: '#c8f442'}}>
                us qui blanditiis praesentium voluptatum deleniti atqu us qui
                blanditiis praesentium voluptatum deleniti atqu us qui
                blanditiis praesentium voluptatum deleniti atqu
              </td>
              <td style={{backgroundColor: '#f441cd'}}>
                us qui blanditiis praesentium voluptatum deleniti atqu us qui
                blanditiis praesentium voluptatum deleniti atqu
              </td>
            </tr>
            <tr>
              <td rowSpan="2" style={{backgroundColor: '#41f4d9'}}>
                At vero eos et accusamus et iusto odio dignissimos ducimus qui
                blanditiis praesen
              </td>
              <td colSpan="2">
                At vero eos et accusamus et iusto odio dignissimos ducimus qui
                blanditiis praesen
              </td>
            </tr>
            <tr>
              <td style={STYLE_BACKGROUND_COLOR}>
                At vero eos et accusamus et iusto odio dignissimos ducimus qui
                blanditiis praesen
              </td>
              <td>
                At vero eos et accusamus et iusto odio dignissimos ducimus qui
                blanditiis praesen
              </td>
            </tr>
          </tbody>
        </table>
        <h1>nt occaecati cupiditate non provident, similique sunt in culpa</h1>
        <p>nt occaecati cupiditate non provident, similique sunt in culpa</p>
        <p>
          nt occaecati cupiditate non provident, similique sunt in culpa
          <math data-latex="x+y=2" />
          nt occaecati cupiditate non provident, similique sunt in culpa
        </p>
        <p style={{lineHeight: '200%'}}>
          <img src="https://placekitten.com/200/300" style={STYLE_FLOAT_LEFT} />
          nt occaecati cupiditate non provident, similique sunt in culpa
          <a href="https://github.com/chanzuckerberg/czi-prosemirror">
            nt occaecati cupiditate non provident, similique sunt in culpa
          </a>
          nt occaecati cupiditate non provident, similique sunt in culpa
          <span style={STYLE_FONT_FAMILY}>
            nt occaecati cupiditate non provident, similique sunt in culpa
          </span>
          nt occaecati cupiditate non provident, similique sunt in culpa
          <span style={STYLE_COLOR}>nt occaecati cupiditate</span>
        </p>
        <ol>
          <li>
            <span style={STYLE_COLOR}>
              uia consequuntur magni dolores eos qui rati
            </span>
          </li>
          <li>
            <span style={STYLE_BACKGROUND_COLOR}>
              uia consequuntur magni dolores eos qui rati
            </span>
          </li>
          <li>
            <b>uia consequuntur magni dolores eos qui rati</b>
          </li>
          <li>
            <u>
              uia conseq eos qui rati <i>uuntur magni dolores</i>uuntur magni
              dolores
            </u>
          </li>
        </ol>
        <p>
          l impedit quo minus id quod maxime placeat facere pos
          <span style={STYLE_BACKGROUND_COLOR}>
            l impedit quo minus id quod maxime placeat facere pos
          </span>
          l impedit quo minus id quod maxime placeat facere pos
          <a href="https://github.com/chanzuckerberg/czi-prosemirror">
            l impedit quo minus id quod maxime placeat facere pos
          </a>
        </p>
        <blockquote style={{textAlign: 'center'}}>
          Singapura bombay for norwegian forest tom tabby.
        </blockquote>
      </div>
    );
  }
}

export default DemoAppHTMLTemplate;
