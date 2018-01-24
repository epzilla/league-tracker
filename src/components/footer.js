const Footer = ({ slogan, img }) => {
  return (
    <div class="footer">
      <img src={ img } />
      <h3 class="footer-text">{ slogan }</h3>
    </div>
  );
};

export default Footer;