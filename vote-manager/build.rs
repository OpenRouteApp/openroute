fn main() -> Result<(), Box<dyn std::error::Error>> {
    let proto_path = std::env::var("PROTO_PATH").unwrap_or_else(|_| "../proto".to_string());

    tonic_build::configure()
        .compile(
            &[
                format!("{}/vote-manager.proto", proto_path).as_str(),
                format!("{}/types.proto", proto_path).as_str(),
            ],
            &[&proto_path],
        )?;

    Ok(())
}
