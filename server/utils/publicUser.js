// The only shape of a user that is ever sent to the logged-in user about themselves.
module.exports = (u) => ({
  id: String(u._id), name: u.name, username: u.username, email: u.email, avatar: u.avatar,
  provider: u.provider, locality: u.locality, skill: u.skill,
  age: u.age, bio: u.bio || '', sports: u.sports || [], playTimes: u.playTimes || [], days: u.days || [],
  hasLocation: Number.isFinite(u.lat) && Number.isFinite(u.lng),
});
