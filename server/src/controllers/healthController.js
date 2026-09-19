export const getHealth = (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'SkillForge server is running',
    timestamp: new Date().toISOString()
  });
};
