
export type LupaProgramInformationStructure = {
    program_name: String,
    program_description: String,
    program_slots: Number,
    program_start_date: Date,
    program_end_date: Date,
    program_duration: String,
    program_time: String,
    program_price: Number,
    program_location: Object,
    program_type: String,
    program_allow_waitlist: Boolean,
    program_structure_uuid: String,
    program_workout_data: Object,
    program_image: String,
    program_tags: Array<String>,
    program_owner: String,
    program_participants: Array<String>,
    program_workout_days: Array<String>
}