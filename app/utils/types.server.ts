enum gender {
  male,
  female,
  others,
}
export type Register = {
  email: string
  password: string
  name: string
  id: string
  gender: gender
  profilePicture: string
}
