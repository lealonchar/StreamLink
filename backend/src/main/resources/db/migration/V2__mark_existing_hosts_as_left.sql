UPDATE room_participants AS participant
SET left_at = NOW(),
    updated_at = NOW()
FROM rooms AS room
WHERE participant.room_id = room.id
  AND participant.user_id = room.created_by
  AND participant.role = 'HOST'
  AND participant.left_at IS NULL;
