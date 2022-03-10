import {
  Button,
  Grid,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Snackbar,
  Alert
} from '@mui/material';
import { css } from '@emotion/css'
import type { NextPage } from 'next'
import useStore from "../store/store";
import { useState } from 'react'

const Home: NextPage = (props: any) => {
  const formField = props.data
  const formValue = props.value
  const [loading, setLoading] = useState(false)
  const [snackBar, setSnackBar] = useState({
    type: 'success',
    message: 'Form Saved',
    open: false
  })
  const setForm = useStore(state => state.setForm)
  setForm(formValue)

  const handleChange = (e: any) => {
    const { value, name } = e.target
    formValue[name] = value
    setForm(formValue)
  }

  const handleOpenSnackbar = (type: string, message: string) => {
    setSnackBar({
      open: true,
      type,
      message
    });
  };

  const handleCloseSnackbar = () => {
    setSnackBar({
      ...snackBar,
      open: false,
    });
  }

  const submit = async () => {
    setLoading(true)
    const req = await fetch(
      `${process.env.API_URL}`,
      {
        method: 'POST',
        body: JSON.stringify(formValue),
        headers: {
          'Content-Type': 'application/json',
        },
      })

    const res = await req.json()
    if (res.success) {
      handleOpenSnackbar('success', 'Form Saved Successfully!')
    } else {
      handleOpenSnackbar('alert', 'Failed Saving Form!')
    }
    setLoading(false)
  }

  const getLabel = (name: string) => {
    if (name === 'firstName') {
      return "First Name"
    }
    if (name === 'lastName') {
      return "Last Name"
    }
    if (name === 'emailAddress') {
      return "Email Address"
    }
    if (name != "") {
      return name.charAt(0).toUpperCase() + name.slice(1)
    }
  }

  const renderFields = (name: any, value: any, type: string, options: any) => {
    let field = null
    if (type === 'text' || type === 'number' || type === 'email') {
      field = <TextField id="outlined-basic"
        fullWidth
        name={name}
        type={type}
        disabled={loading}
        label={getLabel(name)}
        variant="outlined"
        defaultValue={formValue[name]}
        onChange={handleChange} />
    }
    if (type === 'select') {
      field =
        <>
          <FormControl fullWidth>
            <InputLabel
              id="demo-simple-select-label">
              {getLabel(name)}
            </InputLabel>
            <Select
              fullWidth
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              name={name}
              defaultValue={formValue[name]}
              disabled={loading}
              label={getLabel(name)}
              onChange={handleChange}
            >
              {
                options && options?.map((opt: any) => {
                  return (
                    <MenuItem
                      key={opt}
                      value={opt}>
                      { opt}
                    </MenuItem>
                  );
                })
              }
            </Select>
          </FormControl>
        </>
    }
    if (type === 'multiline') {
      field = <TextField
        id="outlined-multiline-static"
        label={getLabel(name)}
        multiline
        rows={4}
        disabled={loading}
        defaultValue={formValue[name]}
        fullWidth
        onChange={handleChange} />

    }
    field = <Grid item> {field} </Grid>
    return field
  }

  return (
    <>
      <form>
        <Grid container direction="column" spacing={2}>
          {
            formField.map((field: any) => {
              return renderFields(field.fieldName, field.value, field.type, field.options)
            })
          }
          <Grid className={css`
                display:flex;
                justify-content:center;
              `} item>
            <Button
              disabled={loading}
              variant="contained"
              onClick={() => { submit(); }}>
              Submit
            </Button>
          </Grid>
        </Grid>
      </form>
      <Snackbar
        open={snackBar.open}
        autoHideDuration={1000}
        onClose={handleCloseSnackbar}>
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackBar.type === 'success' ? 'success' : 'error'}
          sx={{ width: '100%' }}>
          {snackBar.message}
        </Alert>
      </Snackbar>
    </>
  );
}

export default Home

export const getServerSideProps = async () => {
  const res = await fetch(
    `${process.env.API_URL}`
  );
  const data = await res.json()
  let value: any = {}
  if (data && data.success) {
    data.data.forEach((fields: any) => {
      value[fields.fieldName] = fields.value
    })
    return { props: { data: data.data, value } }
  }
  return { props: { data: [], value: {} } }
};