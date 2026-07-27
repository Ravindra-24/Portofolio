export const isHttpUrl = (value) => {
  if (!value) return true
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch (error) {
    return false
  }
}

export const validateImage = (file) => {
  if (!file) return ''
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
    return 'Use a JPEG, PNG, or WebP image.'
  }
  if (file.size > 5 * 1024 * 1024) {
    return 'Images must be 5 MB or smaller.'
  }
  return ''
}

export const validatePdf = (file) => {
  if (!file) return ''
  if (file.type !== 'application/pdf') return 'The CV must be a PDF.'
  if (file.size > 10 * 1024 * 1024) {
    return 'The CV must be 10 MB or smaller.'
  }
  return ''
}

export const validateEntry = (section, values, hasExistingImage) => {
  const errors = {}
  const required = (key, label, max = 120) => {
    const value = values[key]?.trim()
    if (!value) errors[key] = `${label} is required.`
    else if (value.length > max) {
      errors[key] = `${label} must be ${max} characters or fewer.`
    }
  }

  if (section === 'skills') required('name', 'Skill', 60)

  if (section === 'projects') {
    required('name', 'Project name')
    required('description', 'Description', 2000)
    if (!isHttpUrl(values.websiteUrl)) {
      errors.websiteUrl = 'Enter a valid HTTP or HTTPS URL.'
    }
    if (!isHttpUrl(values.githubUrl)) {
      errors.githubUrl = 'Enter a valid HTTP or HTTPS URL.'
    }
    if (!values.file && !hasExistingImage) errors.file = 'An image is required.'
    if ((values.skills || []).length > 20) {
      errors.skills = 'Use no more than 20 skills.'
    }
  }

  if (section === 'experience') {
    required('title', 'Role')
    required('company', 'Company')
    required('period', 'Period')
    if ((values.bullets || []).length > 10) {
      errors.bullets = 'Use no more than 10 bullet points.'
    } else if ((values.bullets || []).some((bullet) => bullet.length > 500)) {
      errors.bullets = 'Each bullet must be 500 characters or fewer.'
    }
  }

  if (section === 'education') {
    required('institution', 'Institution')
    required('degree', 'Degree')
    required('dates', 'Dates')
  }

  if (section === 'certificates') {
    required('name', 'Certificate name')
    if ((values.description || '').length > 2000) {
      errors.description = 'Description must be 2,000 characters or fewer.'
    }
    if (!values.file && !hasExistingImage) errors.file = 'An image is required.'
  }

  const fileError = validateImage(values.file)
  if (fileError) errors.file = fileError
  return errors
}
