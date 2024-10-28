
// import "./style.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faCircleArrowRight } from '@fortawesome/free-solid-svg-icons';
import './home.css'
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import logo from '../../assets/logoKts.png'
function Home() {
  const [tog, setTog] = useState()
  const handleResize = () => {
    const windowWidth = window.innerWidth;
    setTog(windowWidth <= 992);
  };
  useEffect(() => {
    // Set the initial state based on the window width
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  const style={width: tog ? '100%':'60%', paddingBottom:"33px"}
  return (
    <div className="p-0 bg-light">
     <div className="bg-primary"  style={{height: "352px"}}>
      <p className="fs-4 fw-bolder text-light p-3">KTS Support Center</p>
     </div>
     <div className=" d-flex justify-content-center">
      <div className="container-lg bg-white px-5 pt-4" style={style}>
        <div className="d-flex flex-column">
          <header>
            <div className='d-flex justify-content-start align-items-center'>
              <div style={{height: '50px', width:'50px', marginRight: '16px'}}>
                <img src={logo} alt="logo" className='w-100 h-100'/>
              </div>
              <p className='fs-3 mb-0'>KTS Service Desk</p>
            </div>
            <div className='w-100 mt-3'>
              <p className='fs-6'>សូមស្វាគមន៍មកកាន់សេវាជំនួយបច្ចេកទេសរបស់ក្រុមហ៊ុនKTS</p>
            </div>
          </header>
          <div className='position-relative' style={{margin: "28px 0px 8px"}}>
            <h2 className='contact'>
              <label className='d-flex align-items-center'>
                <FontAwesomeIcon icon={faEnvelope} style={{marginRight:'8px'}}/>
                <span className=''>Contact Us About</span>
              </label>
            </h2>
            <ul className='uli list-group slide-in-up'>
              <li style={{marginBottom:'32px'}} className='list-group-item rounded-3'>
                <Link to='/issueCus' href="" className='text-decoration-none'>
                  <div className="bg-light d-flex align-items-center justify-content-md-between align-items-center">
                    <div className='d-flex w-100 l1' style={{padding: '24px'}}>
                      <div className='l2'>
                        <div className='text'>ជំនួយផ្នែកបច្ចេកទេសទូទៅ (Customers IT Support)</div>
                        <div className='' style={{marginTop: "4px"}}> 
                          <span className='text-dark'>
                          ជំនួយការបច្ចេកទេសសំរាប់អតិថិជន
                          </span> 
                        </div>
                      </div>
                    </div>
                    <div style={{marginRight:'8px'}}>
                      <FontAwesomeIcon icon={faCircleArrowRight} className='fs-5'/>
                    </div>
                  </div>
                </Link>
              </li>
              <li style={{marginBottom:'32px'}} className='list-group-item rounded-3'>
                <Link to='/issueInter' href="#" className='text-decoration-none'>
                  <div className="bg-light d-flex align-items-center justify-content-md-between align-items-center">
                    <div className='d-flex w-100 l1' style={{padding: '24px'}}>
                      <div className='l2'>
                        <div className='text'>ជំនួយបច្ចេកទេសសំរាប់ KTS (Internal IT Support)</div>
                        <div className='' style={{marginTop: "4px"}}> 
                          <span className='text-dark'>
                          ជំនួយការបច្ចេកទេសសំរាប់ KTS 
                          </span> 
                        </div>
                      </div>
                    </div>
                    <div style={{marginRight:'8px'}}>
                      <FontAwesomeIcon icon={faCircleArrowRight} className='fs-5'/>
                    </div>
                  </div>
                </Link>
              </li>
              <li style={{marginBottom:'32px'}} className='list-group-item rounded-3'>
                <Link to='/Card' href="#" className='text-decoration-none'>
                  <div className="bg-light d-flex align-items-center justify-content-md-between align-items-center">
                    <div className='d-flex w-100 l1' style={{padding: '24px'}}>
                      <div className='l2'>
                        <div className='text'>របាយការណ៏កាតខូច(DL & RC)</div>
                        <div className='' style={{marginTop: "4px"}}> 
                          <span className='text-dark'>
                          របាយការណ៏កាតខូចសំរាប់ KTS និង​ External 
                          </span> 
                        </div>
                      </div>
                    </div>
                    <div style={{marginRight:'8px'}}>
                      <FontAwesomeIcon icon={faCircleArrowRight} className='fs-5'/>
                    </div>
                  </div>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>        
     </div>
    </div>
  );
}
export default Home;