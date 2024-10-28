import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useEffect, useState } from "react";
import Alert from "react-bootstrap/Alert";
function ModalClient({
  show,
  onHide,
  onAddClient,
  binCodes,
  titles,
  pluss,
  editRow,
  res,
  valid,
  nameEns,
  name,
  updateCheck,
  buttonu
}) {
  const [title, setTitle] = useState(titles);
  const [plus, setPlus] = useState(1);
  const [binCode, setBinCode] = useState(binCodes);
  const [check, setCheck] = useState(false);
  const [id, setId] = useState();
  const [ress, setRess] = useState([])
  useEffect(() => {
    setCheck(valid);
  }, [valid]);
  useEffect(() => {
    if (editRow) {
      setBinCode(editRow.code);
      setTitle(editRow.name);
      setId(editRow.id);
    }
  }, [editRow, plus]);
  const data = { title, binCode, id };
  useEffect(() => {
    setBinCode(binCodes);
    setTitle(titles);
  }, [pluss]);
useEffect(()=>{setRess(res)},[res]) 
  return (
    <Modal
      backdrop="static"
      show={show}
      onHide={onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      {check && (
        <Alert variant="danger" style={{ margin: "0px" }}>
          {ress}
        </Alert>
       )}  
      <Modal.Header
        closeButton
        onClick={() => {
          setBinCode("");
          setTitle("");
          setPlus(plus + 1);
          setCheck(false);
          updateCheck(() => {
            return false;
          });
          setRess('');
        }}
      >
        <Modal.Title>{name}</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ padding: "0px" }}>
        <form
          onSubmit={(e) => {
            onAddClient(e, data);
          }}
          action=""
          className="mt-2"
        >
          <div className="m-3">
            <input
              type="text"
              value={binCode}
              className="form-control"
              placeholder="BinCode..."
              onChange={(e) => {
                setBinCode(e.target.value);
              }}
              required
            />
          </div>
          <div className="m-3">
            <input
              type="text"
              value={title}
              className="form-control"
              placeholder="Name..."
              required
              onChange={(e) => {
                setTitle(e.target.value);
              }}
            />
          </div>
          <hr />
          <div className="d-flex justify-content-end m-2">
            <Button
              variant="primary"
              type="submit"
              
            >
              {buttonu}
            </Button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
}
export default ModalClient;
